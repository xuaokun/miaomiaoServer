var mongoose = require('mongoose')
var {Head} = require('../utils/config.js')
var url = require('url')
mongoose.set('useCreateIndex',true)
var UserSchema = new mongoose.Schema({
	username: {type: String, require: true, index:{unique: true}},
	password: {type: String, require: true},
	email: {type: String, require: true, index:{unique: true}},
	date: {type: Date, default: Date.now()},
	isAdmin: {type: Boolean, default: false},
	isFreeze: {type: Boolean, default: false},
	userHead: {type: String, default: url.resolve(Head.baseUrl,'default.png') }
})

var UserModel = mongoose.model('user',UserSchema)
UserModel.createIndexes()

var save = (data)=>{
	var user = new UserModel(data)//注意data要放在model对象参数中
	return user.save().then(()=>{
		return true
	})
	.catch(()=>{
		return false
	})
}

var findLogin = (data)=>{
	return UserModel.findOne(data)
}
var updatePassword = (email,newPass)=>{
	return UserModel.update({email},{$set:{password:newPass}}).then(()=>{
		return true
	}).catch(()=>{
		return false
	})
}

var updateIsFreeze = (email,isFreeze)=>{
	return UserModel.update({email},{$set:{isFreeze}}).then(()=>{
		return true
	}).catch(()=>{
		return false
	})
}
var updateUserHead = (userHead,username)=>{
	return UserModel.update({username},{$set:{userHead}}).then(()=>{
		return true
	}).catch(()=>{
		return false
	})
}

var deleteUser = (email)=>{
	return UserModel.remove({email}).then(()=>{
		return true
	}).catch(()=>{
		return false
	})
}

var userList = ()=>{
	return UserModel.find()
}


module.exports = {
	save,
	findLogin,
	updatePassword,
	userList,
	updateIsFreeze,
	deleteUser,
	updateUserHead
}