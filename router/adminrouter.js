const express = require('express')
const adminrouter = express.Router();
const multer = require("../middleware/multer")
const admincontroller = require('../contoller/admincontroller');
const productController = require('../contoller/productcontroller');
const auth = require('../middleware/adminauth');
const brandcontroller = require('../contoller/brandcontroller');
const ordercontroller =require('../contoller/orderController')
// const productStorage=require('../middleware/multer')
// const productUpload = multer({uploadMulter:productStorage})
// const {adminExist,verifyadmin}=require('../middleware/adminauth')




adminrouter.get('/', admincontroller.toadmin);
adminrouter.post('/', admincontroller.admin)
adminrouter.get('/admindashboard', auth.authMiddleware, admincontroller.toadmindashboard)
adminrouter.get('/mangeuser', auth.authMiddleware, admincontroller.usermanagement)
// router.get('/usermangerment',admincontroller.touserlist)
adminrouter.post('/block/:userId', auth.authMiddleware, admincontroller.BlockandUnblock)
adminrouter.post('/unblock/:userId', auth.authMiddleware, admincontroller.unBlock)
// router.get('/addcategory',admincontroller.addcategory)
adminrouter.post('/addcategory', auth.authMiddleware, admincontroller.postaddcategory)
adminrouter.get('/addcategory', auth.authMiddleware, admincontroller.addcategory)
adminrouter.get('/editCategory/:id', auth.authMiddleware, admincontroller.editCategory)
adminrouter.post('/editCategory/:id', auth.authMiddleware, admincontroller.editedCategory)
adminrouter.post('/disable/:userId', auth.authMiddleware, admincontroller.disableandenable)
adminrouter.post('/enable/:userId', auth.authMiddleware, admincontroller.enable)
adminrouter.get('/category', auth.authMiddleware, admincontroller.tocategory)
// adminrouter.get('/product',admincontroller.toproduct)


//product

adminrouter.get('/product', auth.authMiddleware, productController.product_get)
adminrouter.get('/addproduct', auth.authMiddleware, productController.addproduct_get)
adminrouter.post('/addproduct', auth.authMiddleware, multer.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), productController.addproduct_post)
adminrouter.get('/blockProduct/:id', auth.authMiddleware, productController.getBlockProduct)
adminrouter.get('/productDetails/:id', auth.authMiddleware, productController.productDetails)
adminrouter.get('/editProduct/:id', auth.authMiddleware, productController.editGetProduct)
adminrouter.post('/editProduct/:id', auth.authMiddleware, multer.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), productController.postEditProduct)
adminrouter.get('/cancelProduct', auth.authMiddleware, productController.cancelProduct)
adminrouter.get('/deleteProduct/:id', auth.authMiddleware, productController.deleteProduct)
adminrouter.delete('/delete-image/:id/:index',auth.authMiddleware, productController.deleteimage)
//brand
adminrouter.get("/brand", auth.authMiddleware, brandcontroller.getBrand)
adminrouter.get("/addBrand", auth.authMiddleware, brandcontroller.getAddBrand)
adminrouter.post("/addBrand", auth.authMiddleware, brandcontroller.addBrand)
adminrouter.get("/deleteBrand/:id", auth.authMiddleware, brandcontroller.deleteBrand)
adminrouter.get("/editBrand/:id", auth.authMiddleware, brandcontroller.editBrand)
adminrouter.post("/editBrand/:id", auth.authMiddleware, brandcontroller.editedBrand)

//order

adminrouter.get("/order_list",auth.authMiddleware,ordercontroller.getorder)


module.exports = adminrouter; 