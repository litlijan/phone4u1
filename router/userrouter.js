
const express = require("express");
const router = express.Router();
const admincontroller = require('../contoller/admincontroller');

const cartcontroller=require('../contoller/cartcontroller')
const otpcontroller = require('../contoller/otpcontroller');
const usercontroller = require('../contoller/usercontroller');
const orderController=require('../contoller/orderController')



const userauths=require('../middleware/userauth')

router.get('/',usercontroller.tohome);
router.get('/user/login',usercontroller.tologin);
router.post('/user/login',usercontroller.userlogin);

router.get('/user/sign',usercontroller.toSignup);

router.post('/user/signup', usercontroller.signup);
router.get('/user/userdashboard',userauths.verifyUser, usercontroller.touserdash)
router.get('/user/home',usercontroller.tologout)
router.get('/user/productDetails/:id', usercontroller.details);
router.get('/user/restpassword',usercontroller.restpassword)
//.......................................
router.get('/forgotPwd', usercontroller.forgotPwd)
router.post('/forgotPwd', usercontroller.forgotPWDPost)
router.post('/postforotp', usercontroller.forotp)
router.get('/passwordrecovery', usercontroller.getPasswordRecovery)
router.post('/passwordrecovery', usercontroller.passwordRecoveryPost)
router.get('/passwordResendOtp', usercontroller.PasswordResendOtp)





// Handle OTP sending
router.get('/sendotp', usercontroller.otpsender);

router.post('/postSignUp', usercontroller.otpverify)

router.get('/userProductDetails/:id',userauths.verifyUser,usercontroller.getUserProductDetails);

router.get('/resendotp',userauths.verifyUser,usercontroller.resendOtp)

//cart 

router.get('/user/cart',userauths.verifyUser, cartcontroller.cart)
router.post('/user/cart',userauths.verifyUser, cartcontroller.postcart)
router.post('/addtocart',userauths.verifyUser, cartcontroller.getcart)
router.get('/removefromcart/:_id', userauths.verifyUser,cartcontroller.removeFromCart)
router.get('/user/checkout',userauths.verifyUser,cartcontroller.PlaceOrder)
router.post('/updateQuantity',userauths.verifyUser,cartcontroller.updatingQuantity)

//userprofile

router.get('/userprofile',userauths.verifyUser,usercontroller.profiles)
router.get('/address',userauths.verifyUser,usercontroller.address)
router.post('/addaddress',userauths.verifyUser,usercontroller.addaddressProfile)
router.delete('/deleteAddress/:addressId',userauths.verifyUser,usercontroller.deleteAddress)
router.get('/edituserAddress/:addressId',userauths.verifyUser,usercontroller.edituserAddress)
router.post('/edituserAddress/:addressId',userauths.verifyUser,usercontroller.updateediteduserAddress)
router.post('/updateProfile',userauths.verifyUser,usercontroller.updateProfile)
router.post('/userPasswordReset',userauths.verifyUser,usercontroller.userPasswordReset)


// order

router.post('/addAddress-Checkout',userauths.verifyUser,usercontroller.orderAddress)
router.post('/user/checkout',userauths.verifyUser,usercontroller.postOrderList)
router.get('/ordersuccess',userauths.verifyUser,usercontroller.orderSuccess)
router.get('/user/trackOrder',userauths.verifyUser,usercontroller.orderHistory)
router.get('/cancelorder/:orderId',userauths.verifyUser,usercontroller.cancelOrder)
router.post('/verify-payment',userauths.verifyUser,orderController.verifyPayment)
router.get('/orderLists',userauths.verifyUser,usercontroller.orderlists)
router.get('/aboutUs',userauths.verifyUser,usercontroller.about)
router.get('/downloadinvoice/:orderId',userauths.verifyUser,usercontroller.downloadInvoice)
router.post('/downloadinvoice',userauths.verifyUser,usercontroller.generateInvoices)
router.post('/failedpayment',userauths.verifyUser,usercontroller.payment)
router.post('/failed',userauths.verifyUser,usercontroller.failedpayment)

//coupoun

router.get('/coupoun',userauths.verifyUser,usercontroller.getcoupoun)
router.post('/checkCoupon',userauths.verifyUser,usercontroller.postcoupoun)
 





module.exports = router;

