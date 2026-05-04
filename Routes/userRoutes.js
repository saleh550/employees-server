const express=require('express')
const router=express.Router()
const {registrUser,loginUser,getMe}=require('../Controllers/userControllers')
const {protect}=require("../middleware/authMiddleware")

router.post('/',registrUser)
router.get('/me',protect,getMe) 
router.post('/login',loginUser)

module.exports=router
