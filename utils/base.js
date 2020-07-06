const crypto = require('crypto');
const captcha = require('trek-captcha');

//加密密码
var setCrypto = (info)=>{
	const secret = 'cx1001';
	return crypto.createHmac('sha256', secret)
	                   .update(info)
	                   .digest('hex');
}

//图形验证码生成
var createVerify = (req,res)=>{
	return captcha().then((info)=>{
		req.session.verifyImg = info.token
		return info.buffer
	}).catch(()=>{
		return false
	})
}

module.exports = {
	setCrypto,
	createVerify
}
