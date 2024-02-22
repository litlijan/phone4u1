const Razorpay = require('razorpay');
require("dotenv").config();
module.exports = {
    createRazorpayOrder: (order) => {
        return new Promise((resolve, reject) => {
            const razorpay = new Razorpay({
                key_id:  process.env.RZP_TEST_KEY_ID,
                key_secret:  process.env.RZP_TEST_KEY_SECRET,
            });
            console.log("inside ordereeeeeeeeeeeeeeeeeeeeee",order);
          
            const razorpayOrder = razorpay.orders.create({
                amount: order.amount * 100, 
                currency: 'INR',
                receipt: order.receipt,
            });
    
            resolve(razorpayOrder) ;
        });
    }
};
