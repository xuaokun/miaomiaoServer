var express = require('express')
var router = express.Router()
var adminController = require('../controllers/admin.js')

router.use((req,res,next)=>{
	if(req.session.username && req.session.isAdmin){
		next()
	}else{
		res.send({
			msg: '没有管理权限',
			status: -1
		})
	}
})

router.get('/',adminController.index)
router.get('/userlist',adminController.userList)
router.post('/updateIsFreeze',adminController.updateFreeze)
router.post('/deleteUser',adminController.deleteUser)
module.exports = router