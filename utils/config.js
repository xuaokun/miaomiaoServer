var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var Mongoose = {
	url: 'mongodb://localhost:27017/miaomiao',
	connect(){
		mongoose.connect(this.url,{ useNewUrlParser: true ,useUnifiedTopology: true },(err)=>{
			if(err){
				console.log("数据库连接失败")
				return
			}
			console.log("数据库连接成功")
		})
	}
}

var Email = {
	config:{
		host: "smtp.qq.com",
		    port: 587,
		    auth: {
		      user: '1341235168@qq.com', // generated ethereal user
		      pass: '', // generated ethereal password
		    }
	},
	transporter(){
		return nodemailer.createTransport(this.config)
	},
	verify(){
		return Math.random().toString().substr(2,6);
	},
	time(){
		return Date.now()
	}
}

var Head = {
	baseUrl : 'http://118.190.36.126:3000/uploads/'
}

module.exports = {
	Mongoose,
	Email,
	Head
}
