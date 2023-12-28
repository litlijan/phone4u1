
const express = require("express");
const router = express.Router();
const admincontroller = require('../contoller/admincontroller');

const cartcontroller=require('../contoller/cartcontroller')
const otpcontroller = require('../contoller/otpcontroller');
const usercontroller = require('../contoller/usercontroller');

const userauths=require('../middleware/userauth')

router.get('/',usercontroller.tohome);
router.get('/user/login',usercontroller.tologin);
router.post('/user/login',usercontroller.userlogin);

router.get('/user/sign',usercontroller.toSignup);

router.post('/user/signup', usercontroller.signup);
router.get('/user/userdashboard',userauths.verifyUser, usercontroller.touserdash)
router.get('/user/home',usercontroller.tologout)
router.get('/user/restpassword',usercontroller.restpassword)
//.......................................
router.get('/forgotPwd', usercontroller.forgotPwd)
router.post('/forgotPwd', usercontroller.forgotPWDPost)
router.post('/postforotp', usercontroller.forotp)
router.get('/passwordrecovery', usercontroller.getPasswordRecovery)
router.post('/passwordrecovery', usercontroller.passwordRecoveryPost)
router.get('/passwordResendOtp', usercontroller.PasswordResendOtp)



router.post('/updateQuantity',cartcontroller.updatingQuantity)

// Handle OTP sending
router.get('/sendotp', usercontroller.otpsender);

router.post('/postSignUp', usercontroller.otpverify)

router.get('/userProductDetails/:id', usercontroller.getUserProductDetails);

router.get('/user/resendotp',usercontroller.resendOtp)

//cart 

router.get('/user/cart', cartcontroller.cart)
router.post('/user/cart', cartcontroller.postcart)
router.post('/addtocart', cartcontroller.getcart)
router.get('/removefromcart/:_id',cartcontroller.removeFromCart)
router.get('/user/checkout',cartcontroller.PlaceOrder)
// router.post('/user-make-purchase',cartcontroller.outofstock)

//userprofile

router.get('/userprofile',usercontroller.profiles)
router.get('/address',usercontroller.address)
router.post('/addaddress',usercontroller.addaddressProfile)
router.delete('/deleteAddress/:addressId',usercontroller.deleteAddress)
router.get('/edituserAddress/:addressId',usercontroller.edituserAddress)
router.post('/edituserAddress/:addressId',usercontroller.updateediteduserAddress)
router.post('/updateProfile',usercontroller.updateProfile)
router.post('/userPasswordReset',usercontroller.userPasswordReset)

// order

router.post('/addAddress-Checkout',usercontroller.orderAddress)
router.post('/user/checkout',usercontroller.postOrderList)
router.get('/ordersuccess',usercontroller.orderSuccess)
router.get('/user/trackOrder',usercontroller.orderHistory)
router.get('/cancelorder/:orderId',usercontroller.cancelOrder)



module.exports = router;

