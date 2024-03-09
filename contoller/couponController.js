require('../config/dbconfig')

const { findOne } = require('../model/admin')
const coupons = require("../model/couponSchema");
const user=require('../model/user')
module.exports={

     couponget: async (req,res)=>{
      try {
         const coupon = await coupons.find();
         const date = new Date();
         res.render('./admin/couponManagement', { coupon, date });
       } catch (error) {
         console.log(error);
       }
     },
     addcoupon:async(req,res)=>{
      try {
         console.log(req.body,"coupon body2222222222222222222222");
      
         if(req.body.discountType=='fixed')
         {
            console.log(req.body.discountType,'3333333333333333333333333333333333');
            req.body.amount=req.body.amount[1];
            console.log(req.body.amount,"77777777777777777777777777");
         }else if(req.body.discountType=='percentage')
         {
            req.body.amount=req.body.amount[0];
         }
         const exist=await coupons.findOne({couponCode:req.body.couponCode})
         if(exist)
         {
            return res.json({error:"coupon already exist!!!!"})
         }
         const coupon=await coupons.create(req.body)
         if(coupon)
         {
            console.log("add to collection ??????????????");
            res.json({success:true})
         }
         else{
            console.log("there is some error");
            res.json({ error: "COUPON already consist" });
         }
      } catch (error) {
         console.log(error);
      }

   },
   deleteCoupon:async(req,res)=>{
      const couponId = req.params.couponId;
      try {
        await coupons.findByIdAndDelete(couponId); 
        res.json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

   },
   editcouponget:async(req,res)=>{
      try {
         
         const couponId = req.params.couponId;
         const coupon = await coupons.findById(couponId);
         res.render('./admin/editCoupon', { coupon });
      } catch (error) {
         console.log(error,'the page not get ');
      }
   },
   editcouponpost:async(req,res)=>{
      try {
         
         const { couponName, couponCode, discountType, minAmount, maxAmount, minAmountFixed, limit, couponType, startDate, endDate } = req.body;
         const coupon=await coupons.findById(req.params.couponId)
         
         let amount=0
         if(discountType== 'percentage'){
          amount = Array.isArray(req.body.amount) ? req.body.amount[0] : req.body.amount;
        
         }else if(discountType== 'fixed'){
            amount = Array.isArray(req.body.amount) ? req.body.amount[1] : req.body.amount;
          
         }
         
         coupon.couponName = couponName;
         coupon.couponCode = couponCode;
         coupon.discountType = discountType;
         coupon.amount = amount;
         coupon.minAmount = minAmount;
         coupon.maxAmount = maxAmount;
         coupon.minAmountFixed = minAmountFixed;
         coupon.limit = limit;
         coupon.couponType = couponType;
         coupon.startDate = startDate;
         coupon.endDate = endDate;
     
         await coupon.save();
         res.redirect('/admin/couponManagement');
      } catch (error) {
         console.log(error,'the edit page have some problem ');
      }
   }
    
}