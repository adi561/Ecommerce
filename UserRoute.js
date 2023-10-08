const express=require('express')
const router=express.Router()
const Controller=require('../Controllers/UserControllers')
const OtpSchema=require('../Schemas/Otp')

router.post('/register' ,Controller.addUser)
router.post('/login' ,Controller.login)
router.post('/send_otp' ,Controller.sendOtp)
router.post('/verify_otp' ,Controller.verifyOtpAndChangePassword)
router.get('/get-all-products' ,Controller.AllProducts)


module.exports=router