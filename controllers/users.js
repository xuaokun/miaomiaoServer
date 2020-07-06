var {
	Email,
	Head
} = require('../utils/config.js')
var {
	setCrypto,
	createVerify
} = require('../utils/base.js')
var UserModel = require('../models/users.js')
var fs = require('fs')
var url = require('url')
var login = async (req, res, next) => {
	var {
		username,
		password,
		verifyImg
	} = req.body
	console.log(verifyImg, req.session.verifyImg)
	if (verifyImg !== req.session.verifyImg) {
		res.send({
			msg: '验证码错误',
			status: -3
		})
		return
	}
	var result = await UserModel.findLogin({
		username,
		password: setCrypto(password)
	})
	if (result) {
		req.session.username = username
		req.session.isAdmin = result.isAdmin
		req.session.userHead = result.userHead
		if (result.isFreeze) {
			res.send({
				msg: '账号已冻结',
				status: -2
			})
		}
		res.send({
			msg: '登录成功',
			status: 0
		})
	} else {
		res.send({
			msg: '登录失败',
			status: -1
		})
	}
}
var register = async (req, res, next) => {
	var {
		username,
		password,
		email,
		verify
	} = req.body

	if (email !== req.session.email || verify !== req.session.verify) {
		res.send({
			msg: '验证码错误',
			status: -1
		})
		return
	}
	if ((Email.time() - req.session.time) / 1000 > 60) {
		res.send({
			msg: '验证码过期',
			status: -3
		})
		return
	}
	var result = await UserModel.save({
		username,
		password: setCrypto(password),
		email
	})
	if (result) {
		res.send({
			msg: '注册成功',
			status: 0
		})
	} else {
		res.send({
			msg: '该邮箱已被占用',
			status: -2
		})
	}
}
var verify = async (req, res, next) => {
	var email = req.query.email
	var verify = Email.verify()

	req.session.verify = verify
	req.session.email = email
	req.session.time = Email.time()
	var info = {
		from: '喵喵网 <1341235168@qq.com>', // sender address
		to: email, // list of receivers
		subject: "喵喵网验证码", // Subject line
		text: "验证码：" + verify // plain text body
	};
	Email.transporter().sendMail(info, (err) => {
		if (err) {
			console.log(err)
			res.send({
				msg: '发送验证码失败',
				status: 1
			})
		} else {
			res.send({
				msg: '发送验证码成功',
				status: 0
			})
		}
	})
}
var logout = async (req, res, next) => {
	req.session.username = ''
	res.send({
		msg: '登出成功',
		status: 0
	})
}
var getUser = async (req, res, next) => {
	if (req.session.username) {
		res.send({
			msg: '获取用户信息成功',
			status: 0,
			data: {
				username: req.session.username,
				isAdmin: req.session.isAdmin,
				userHead: req.session.userHead
			}
		})
	} else {
		res.send({
			msg: '获取用户信息失败',
			status: -1
		})
	}
}
var findPassword = async (req, res, next) => {
	var {
		email,
		newPass,
		verify
	} = req.body
	if (email === req.session.email && verify === req.session.verify) {
		var result = UserModel.updatePassword(email, newPass)
		if (result) {
			res.send({
				msg: '密码修改成功',
				status: 0
			})
		} else {
			res.send({
				msg: '修改失败',
				status: -2
			})
		}
	} else {
		res.send({
			msg: "验证码错误",
			status: -1
		})
	}
}

var verifyImg = async (req, res, next) => {
	var result = await createVerify(req, res)
	if (result) {
		res.send(result)
	}
}

var uploadUserHead = async (req, res, next) => {
	await fs.rename('public/uploads/' + req.file.filename, 'public/uploads/' + req.session.username + '.png', (err) => {
		if (err) throw err;
	})//调用fs的一个坑，一定要传入回调
	var result = UserModel.updateUserHead(url.resolve(Head.baseUrl,req.session.username + '.png'),req.session.username)
	if(result){
		res.send({
			msg: '上传成功',
			status: 0,
			data:{
				userHead: url.resolve(Head.baseUrl,req.session.username + '.png')
			}
		})
	}else{
		res.send({
			msg: '上传失败',
			status: -1
		})
	}
}

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword,
	verifyImg,
	uploadUserHead
}
