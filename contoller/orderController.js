const User = require('../model/user')
const product = require('../model/product')
const brand = require('../model/brandSchema')
const category = require('../model/category')
const crypto = require('crypto');
const Order=require('../model/order')
const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');


const getorder=async(req,res)=>{
   try {
    const page = parseInt(req.query.page) || 1; 
    const perPage = 5; 
    const skip = (page - 1) * perPage;
    const order = await Order.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
    const totalCount = await Order.countDocuments();
    
    res.render("./admin/orders", {
        order,
        currentPage: page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
    });
   } catch (error) {
    console.log(error);
   }
}

const verifyPayment = async (req, res) => {
 
    try {
     
      let hmac = crypto.createHmac("sha256", process.env.RZP_TEST_KEY_SECRET);
      hmac.update(
        req.body.payment.razorpay_order_id +
          "|" +
          req.body.payment.razorpay_payment_id
      );
  
      hmac = hmac.digest("hex");
  
      if (hmac === req.body.payment.razorpay_signature) {
        const orderId = new mongoose.Types.ObjectId(
          req.body.order.createdOrder.receipt
        );
  
        const updateOrderDocument = await Order.findByIdAndUpdate(orderId, {
          PaymentStatus: "Paid",
          PaymentMethod: "Online",
        });
       
        res.json({ success: true });
      } else { 
        
        res.json({ failure: true });
      }
    } catch (error) {
      console.error("failed to verify the payment", error);
    }
  };
  const orderdetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        


        const order = await Order.findById(orderId).populate("Items.ProductId");

        if (!order) {
            return res.render("/404");
        }

        const user = await User.findById(order.UserId);

        const orderedProducts = order.Items;

        

        res.render("./admin/orderdetails", {
            OrderedProducts: orderedProducts,
            customerName: user.Address[0].Name,
            customerAddress: user.Address[0],
          
        });
    } catch (error) {
        console.log("Error viewing ordered products:", error);
    }
}

const updateOrderStatus=async(req,res)=>{
  try {
    
    const orderId = req.params.orderId;

    const newStatus = req.body.status;

    await Order.findByIdAndUpdate(orderId, {
      Status: newStatus,
      PaymentStatus: "Pending",
    });

    if (newStatus == "Delivered") {
      const updateOrderDocument = await Order.findByIdAndUpdate(orderId, {
        PaymentStatus: "Paid",
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.json({ success: false });
  }
}
const acceptReturn=async(req,res)=>{
  try {
    const orderId = req.params.orderId; 

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { Status: 'Return Accepted' } },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

const cancelReturn=async(req,res)=>{
  try {
    const orderId = req.params.orderId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { Status: 'Return Canceled' } },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}



module.exports={
    getorder,
    verifyPayment,
    orderdetails,
    updateOrderStatus,
    acceptReturn,
    cancelReturn,
}