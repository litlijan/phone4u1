const bcrypt = require('bcrypt')
const user = require('../model/user')
const Otp = require('../model/otp')
const {sendOTP,generateOTP}= require('./otpcontroller')
const product = require('../model/product')
const brand = require('../model/brandSchema')
const razorpay = require('../utility/razorpay.js');
const category = require('../model/category')
const flash = require("flash")
const Cart = require('../model/cart')
const Order =require('../model/order')
const Coupon=require('../model/couponSchema.js')
const { cart } = require('./cartcontroller')

const tohome = (req, res) => {
    try {
        res.render('./user/home')
    } catch (error) {
        console.log(error);
    }
   
}

const toSignup = (req, res) => {
   try {
    res.render('./user/sign')
   } catch (error) {
    console.log(error);
    res.render("./user/404");
   }
}
const tologin = (req, res) => {
    try {

        res.render('./user/login', { message: req.flash() })
    } catch (error) {
        console.log(error)
        res.render("./user/404");
    }
}


const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        console.log(username);
        console.log(req.body, '..............ppppppp');
        const userExist = await user.findOne({ email: email })

        if (userExist) {
            res.render('./user/sign', { message: 'email already exists' })
        } else {

            const salt = 10
            const hashedPassword = bcrypt.hashSync(password, 10)
            const newUser = {
                name: username,
                email: email,
                password: hashedPassword
            }
            req.session.data = newUser
            req.session.email = email
            req.session.userlogged = true;
            res.redirect("/sendotp")
        }
    } catch (error) {
        console.error(error);
        res.render("./user/404");
       
    }
}
//otp
const otpsender = async (req, res) => {
    try {
        console.log("otp sender");
        const email = req.session.email;
        console.log(email);
        const createdOTP = await sendOTP(email)
        console.log("session before verifiying otp :", req.session.email);
        res.render('./user/otp')

    } catch (error) {
        console.error(error, "send otp")
        res.render("./user/404");
    }
}
const otpverify = async (req, res) => {
    try {
        const otpdata = await Otp.findOne({ email: req.session.email })
        const otp1 = Number(req.body.otp1);
        const otp2 = Number(req.body.otp2);
        const otp3 = Number(req.body.otp3);
        const otp4 = Number(req.body.otp4);
        let arr = [otp1, otp2, otp3, otp4];
        const finalOtp = Number(arr.join(''));
        const products = await product.find();

        if (finalOtp === otpdata.otp) {
            // await email.create(req.session.email)
            res.render('./user/userdashboard', { products })
        }
        else {
            res.render("./user/otp", { message: "otp is incorrect" })
        }
    } catch (error) {
        console.error(error, "OTP not verified");
        res.render("./user/404");
       
    }
}

const resendOtp =async(req,res)=>{
    try {
        if (req.session && req.session.email) {
            const email = req.session.email;
            console.log(email);

            const newOtp = await generateOTP();

            await Otp.updateOne({ email }, { $set: { otp: newOtp } });
            await sendOTP(email);

            console.log("resend");
        } else {
            console.log("Email not found in session data.");
           
        }

        
    } catch (error) {
        console.log("it is not working",error)
    }

}
const touserdash = async (req, res) => {
    const products = await product.find({ display: 'Active' });
    res.render('./user/userdashboard', {
        products
    })
}

const userlogin = async (req, res) => {
    // console.log('');
    try {

        console.log("--------------------", req.body);
        console.log(req.body.email,'###########################')
        const check = await user.findOne({ email: req.body.email })
        console.log(check,'}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}');
        if (check) {
            console.log('-------------------------------------------')
            const isMatch = await bcrypt.compare(req.body.password, check.password)
            if (isMatch) {
                if (check.status == true) {
                    req.session.userlogged = true;
                    console.log(req.body.email, "rewq. body.email");
                    req.session.email = req.body.email
                    console.log(req.session.email, 'req.session.email');
                    res.redirect('/user/userdashboard')
                } else {
                    req.flash("error", "you have been banned")
                    res.redirect('/user/login')
                }
            } else {
                res.render('./user/login', { message: "Invalid password" })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const tologout = (req, res) => {
    res.render('./user/home')
}

const getUserProductDetails = async (req, res) => {
    try {
        const { id } = req.params
        const brands = await brand.findOne({ _id: id })

        const categorys = await category.findOne({ _id: id })
        const displayProduct = await product.findOne({ _id: id }).populate('brand category')

        res.render("./user/userProductDetails", { displayProduct, brands, categorys, id })
    } catch (error) {
        console.log(error);

    }

}

const restpassword = (req, res) => {
    try {
        res.render("./user/restpassword")
    } catch (error) {
        console.log(error);
    }
  
}
const forgotPwd = (req, res) => {

    try {
        res.render('./user/forgotPwd')
    } catch (error) {
        console.log(error)
    }
}

const forgotPWDPost = async (req, res) => {
    try {
        const email = req.body.email
        const users = await user.findOne({ email: email })
        if (users) {
            // let otpToBeSent=Otp.generateotp();
            // otpToBeSent = Otp.otp;
            const result = sendOTP(email)
            req.session.user = users
            req.session.email = email
            res.render("./user/forotp")
        }
        else {
            req.flash("error", "Email not registered with us")
            res.redirect("/user/forgotPwd")
        }
    } catch (error) {
        console.log(error)
    }
}

const forotp = async (req, res) => {
    try {
        const otpdata = await Otp.findOne({ email: req.session.email })
        const otp1 = Number(req.body.otp1);
        const otp2 = Number(req.body.otp2);
        const otp3 = Number(req.body.otp3);
        const otp4 = Number(req.body.otp4);
        let arr = [otp1, otp2, otp3, otp4];
        const finalOtp = Number(arr.join(''));
        const products = await product.find();

        if (finalOtp === otpdata.otp) {
            // await email.create(req.session.email)
            res.render('./user/passwordrecovery', { products })
        }
        else {
            res.render("./user/forotp", { message: "otp is incorrect" })
        }
    } catch (error) {
        console.error(error, "OTP not verified");

        res.status(500).send('Internal Server Error');
    }
}

const getPasswordRecovery = (req, res) => {
    try {
        res.render("./user/passwordrecovery")
    } catch (error) {
        console.log(error);
    }
   
}

const passwordRecoveryPost = async (req, res) => {

    try {
        const email = req.session.user.email
        const { password, confirmpassword } = req.body
        console.log(password, confirmpassword)
        if (password === confirmpassword) {
            const hashpassword = await bcrypt.hash(password, 12)
            const updatedUser = await user.findOneAndUpdate({ email: email }, { $set: { password: hashpassword } })
            req.session.destroy()
            res.redirect("/user/login")
        }
        else {
            req.flash("error", "Password doesnot matched")
            res.redirect("/user/passwordrecovery")
        }
    } catch (error) {
        console.log(error)
    }

}



const PasswordResendOtp = async (req, res) => {
    try {
        const duration = 30;
        const Email = req.session.user.Email;
        console.log()
        otpToBeSent = otpFunctions.sendOTP();
        console.log(otpToBeSent);
        const result = otpFunctions.PasswordResendOtp(req, res, Email, otpToBeSent);
    } catch (error) {
        console.log(error);
        req.flash("error", "error sending OTP");
        res.redirect("/user/restpassword");
    }

}

const profiles = async (req, res) => {
    const username = req.session.email;
   
    try {
        const data = await user.find({ email: username })
        res.render("user/userprofile", {
            profile: data[0], username
        })

    } catch (error) {
        console.error(error)
    }
}

const address = async (req, res) => {
    try {
        const username = req.session.email;
        console.log(username);
        const users = await user.findOne({ email: username })
        console.log("@@@@@@@", users, "%%%%%%%%%");
        if (users) {
            res.render("user/address", { username, users })
        }
        else {
            console.log("user not found")
        }

    } catch (error) {
        console.log(error);
    }
}

const addaddressProfile = async (req, res) => {
    try {
        const addressData = {
            Name: req.body.Name,
            AddressLane: req.body.Address,
            City: req.body.City,
            Pincode: req.body.Pincode,
            State: req.body.State,
            Mobile: req.body.Mobile,
        };

        const userEmail = req.session.email;
        console.log(userEmail, '...............................');

        const users = await user.findOne({ email: userEmail });
        if (!users) {
            return res.render("user/404");
        }

        console.log(users);

        users.Address.push(addressData);
        console.log("Adding address:");
        console.log(addressData);

        await users.save();


        res.redirect("/address");
    } catch (error) {
        console.error("Error while adding the address:", error);
        res.status(500).send("Error while adding the address");
    }
};


const deleteAddress = async (req, res) => {
    try {
        const userEmail = req.session.email; 
        const userr = await user.findOne({ email: userEmail });

        if (!userr) {
            console.log("User not found");
            res.render("error/404");
        }
        const addressId = req.params.addressId;
        const userId = userr._id;
        await user.findOneAndUpdate(
            { _id: userId },
            { $pull: { Address: { _id: addressId } } }
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting address:", err);
        res.render("/user/404");
    }
};

const edituserAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        console.log(addressId, "00000000000000000000000000000000000");
        const userr = await user.findOne({ email: req.session.email });
        console.log(userr, '///////////////////////////');
        const addressToEdit = userr.Address.id(addressId);

        console.log(addressToEdit, '77777777777777777777777');

        if (!addressToEdit) {
            return res.render("user/404");
        }

        res.render("user/editAddress", {
            address: addressToEdit,
            username: req.session.email,
            addressId: addressId,
        });
    } catch (error) {
        console.error("Error occurred while editing address:", error);
        res.render("error");
    }
};

const updateediteduserAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const users = await user.findOne({ email: req.session.email });

        if (!users) {
            return res.render("user/404");
        }

        const addressToEdit = users.Address.id(addressId);

        if (!addressToEdit) {
            return res.render("user/404");
        }

        // Update address fields from form data
        addressToEdit.Name = req.body.Name;
        addressToEdit.AddressLane = req.body.Address;
        addressToEdit.City = req.body.City;
        addressToEdit.Pincode = req.body.Pincode;
        addressToEdit.State = req.body.State;
        addressToEdit.Mobile = req.body.Mobile;

        await users.save();

        res.redirect("/address");
    } catch (error) {
        console.error("Error updating user address:", error);
        res.render("user/404");
    }
};


const updateProfile = async (req, res) => {
    try {
        const userEmail = req.session.email;
        const newName = req.body.name;
        const newEmail = req.body.email;

        const userss = await user.findOne({ email: userEmail });
        userss.name = newName;
        userss.email = newEmail;

        await userss.save();
        if (!userss) {
            return res.render("error/404");
        }

        res.json({ success: true });
    } catch (error) {
        console.log("Error updating user profile:", error);
        res.json({ success: false, error: "Failed to update profile" });
    }
};

const userPasswordReset = async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        console.log(newPassword, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const userr = await user.findOne({ email: req.session.email });
        userr.password = hashedPassword;
        await userr.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.json({ success: false });
    }
};

const orderAddress= async(req,res)=>{
    try {
        const addressData = {
            Name: req.body.Name,
            AddressLane: req.body.Address,
            City: req.body.City,
            Pincode: req.body.Pincode,
            State: req.body.State,
            Mobile: req.body.Mobile,
        };

        const userEmail = req.session.email;
        console.log(userEmail, '...............................');

        const users = await user.findOne({ email: userEmail });
        if (!users) {
            return res.render("user/404");
        }

        console.log(users);

        users.Address.push(addressData);
        console.log("Adding address:");
        console.log(addressData);

        await users.save();

        console.log("Address added:");
        console.log(users); // Log updated user object

        res.redirect("/user/checkout");
    } catch (error) {
        console.error("Error while adding the address:", error);
        res.status(500).send("Error while adding the address");
    }

}


const postOrderList= async (req, res) => {
    try {
        console.log(req.body,"11111111111111111111111111111111111111111111111");
        
        const PaymentMethod = req.body.paymentMethod;
        const Address = req.body.Address;
        const Email = req.session.email;
     
        const total=req.body.total
        
        const users = await user.findOne({ email: Email });
        console.log(users,".............")
        const userid = users._id;
        
    
        // if(PaymentMethod== 'wallet'){
        //   if(user.wallet < amount){
        //     return res.json({error:"Wallet Amount is less than the Total Price"})
        //   }
        // }
    
        const cart = await Cart.findOne({ UserId: users._id }).populate("Items.ProductId");
        console.log(cart,'???????????????????')
    
        if (!cart) {
          console.error("No cart found for the user.");
          return res.render("error/404");
        }
        
        for (const item of cart.Items) {
          const productId = item.ProductId._id;
          const quantityInCart = item.Quantity;
    
          const products = await product.findById(productId);
         
          
          if (products) {
            const availableStock = products.stock;
    
            if (quantityInCart > availableStock) {
              console.error(`Not enough stock available for product ${productId}`);
              return res.json({error:"Not enough stock available for product"})
            }
          }
        }
    
        const address = await user.findOne({
          _id: userid,
          Address: {
            $elemMatch: { _id:Address },
          },
        });
    console.log(address,'bbbbbbbbbbbbbbbbbbbbbbbb')
        const add = {
          Name: address.Address[0].Name,
          Address: address.Address[0].AddressLane,
          Pincode: address.Address[0].Pincode,
          City: address.Address[0].City,
          State: address.Address[0].State,
          Mobile: address.Address[0].Mobile,
        };
    
        const currentDate = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });

        const newOrders = new Order({ 
          UserId: userid,
          Items: cart.products,
          OrderDate: currentDate,
          ExpectedDeliveryDate: new Date(
            Date.now() + 4 * 24 * 60 * 60 * 1000
          ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        //   TotalPrice: amount,
          Address: add,
          PaymentMethod: PaymentMethod,
        });

        console.log(newOrders,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    
        const order = await newOrders.save();
        const newLocal = req.session.orderId = order._id
        console.log(newLocal,'look at me ');
        for (const item of order.Items) {
          const productId = item.productId;
          const quantity = item.quantity;
    
          const products = await product.findById(productId);
          if (products) {
            const updatedQuantity = products.stock - quantity;
    
            if (updatedQuantity < 0) {
              products.stock = 0;
              products.Status = "Out of Stock";
            } else {
              products.stock = updatedQuantity;
              await products.save();
            }
          }
        }
    
        await Cart.findByIdAndDelete(cart._id);
        if (PaymentMethod === "cod") {
            res.json({ codSuccess: true });
        }
        // else if(PaymentMethod === "wallet"){
        //     await user.findByIdAndUpdate(userid, {
        //         $inc: { wallet: -amount },
        //     });
            
        //     const walletTransaction = new WalletTransaction({
        //         user: userid,
        //         amount: amount,
        //         description: "Used For Purchase",
        //         transactionType: "debit",
        //     });
            
        //     await walletTransaction.save();
            
        //     res.json({ wallet: true });
        // }

        else {
            
            const order = {
                amount: total,
                currency: "INR",
                receipt: req.session.orderId,
            };
            console.log("About to create Razorpay order:", order);

    await razorpay.createRazorpayOrder(order)
        .then((createdOrder) => {
            console.log("Payment response from Razorpay:", createdOrder);
            res.json({ online: true, createdOrder, order });
            console.log('1234th code some', order);
        })
        .catch((err) => {
            console.log("Error creating Razorpay order:", err);
            res.status(500).json({ error: "Error creating Razorpay order" });
        });
        }
      } catch (error) {
        console.error("Error placing order:", error);
         res.render("/user/404");
      }
  }

  const orderSuccess =(req,res)=>
  {
    const username = req.session.email;
    res.render("user/orderSuccess", { username });
  }
  const orderHistory =async(req,res)=>{
    try {
        const username = req.session.email;
        const total=req.query.data;
        console.log(total,"88888888888888888888888888888888");
        const users = await user.findOne({ email: username });
        const userid = users._id;
        const orders = await Order.aggregate([
      {
        $match: { UserId: userid }
      },
      {
        $sort: { OrderDate: -1 }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'Items.productId',
          foreignField: '_id',
          as: 'populatedItems'
        }
      }
    ]);
    console.log(orders,"444444444444444444444444");
        //   const products=await product.findOne
    
        if (orders.length === 0) {
          return res.render("./user/orderHistory", { username, orders: [],total });
        } else {
    
          res.render("./user/orderHistory", {
            username,
            orders: orders,
            total
          });
        }
      } catch (error) {
        console.log("error in track order",error);
        // res.render("/user/404");
      }
  }

  const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);
  
      if (!order) {
        console.log("Order not found");
        return res.render("error/404");
      }
  
      if (order.Status === "Order Placed" || order.Status === "Shipped") {
        const productsToUpdate = order.Items;
  
        for (const product of productsToUpdate) {
          const cancelProduct = await product.findById(product.productId);
  
          if (cancelProduct) {
            cancelProduct.stock += product.quantity;
            await cancelProduct.save();
          }
        }
        
        if (order.PaymentMethod === "Online" || order.PaymentMethod === "wallet") {
          const userId = order.UserId;
          const refundAmount = order.TotalPrice;
  
          await user.findByIdAndUpdate(userId, {
            $inc: { wallet: refundAmount },
          });
  
          const walletTransaction = new WalletTransaction({
            user: userId,
            amount: refundAmount,
            description: "Refund for canceled order",
            transactionType: "credit",
          });
  
          await walletTransaction.save();
          
        }
  
        order.Status = "Cancelled";
        await order.save();
        return res.redirect("/user/trackOrder");
      } else {
        console.log("Order cannot be cancelled");
      }
    } catch (error) {
      console.error("Error cancelling the order:", error);
      res.render("error/404");
    }
  };

const getcoupoun= async(req,res)=>{
    const userId = req.session.user;
    const users = await user.find(userId);
    const coupons = await Coupon.find()
    res.render('./user/coupoun',{users,coupons})
  
}

const postcoupoun=async(req,res)=>{
    try {
        console.log("inside try");
        const userId = req.session.user;
        let code = req.body.code;
        let total = req.body.total;
        let discount = 0;
        const couponMatch = await Coupon.findOne({ couponCode: code });
        if (couponMatch) {
          if (couponMatch.status === true) {
            let currentDate = new Date();
            let startDate = couponMatch.startDate;
            let endDate = couponMatch.endDate;
            if (startDate <= currentDate && currentDate <= endDate) {
                if (couponMatch.couponType === "public") {
                  if (couponMatch.limit === 0) {
                    return res.json({ error: "Coupon already applied" });
                  } else {
                    let couponUsed = await Coupon.findOne({
                      couponCode: couponMatch.couponCode,
                      "usedBy.userId": userId,
                    });
                    if (couponUsed) {
                      return res.json({ error: "You have used the coupon once" });
                    } else {
                      if (couponMatch.discountType === "fixed") {
                        console.log("insidee fixedddd");
                        console.log("total", total);
                        if (total >= couponMatch.minAmountFixed) {
                          discount = couponMatch.amount;
                          res.json({ success: true, discount });
                        } else {
                          return res.json({
                            error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
                          });
                        }
                      } else {
                        if (total >= couponMatch.minAmount) {
                          discount = total * (couponMatch.minAmount / 100);
                          res.json({ success: true, discount });
                        } else {
                          return res.json({
                            error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
                          });
                        }
                      }
                    }
                  }
                } else {
                  // private coupon can be applied only to specific user
                  let couponUsed = await Coupon.findOne({
                      couponCode: couponMatch.couponCode,
                      "usedBy.userId": userId,
                    });
                    if (couponUsed) {
                      return res.json({ error: "You have used the coupon once" });
                    } else {
                      if (couponMatch.discountType === "fixed") {
                        console.log("insidee fixedddd");
                        console.log("total", total);
                        if (total >= couponMatch.minAmountFixed) {
                          discount = couponMatch.amount;
                          res.json({ success: true, discount });
                        } else {
                          return res.json({
                            error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
                          });
                        }
                      } else {
                        if (total >= couponMatch.minAmount) {
                          discount = total * (couponMatch.minAmount / 100);
                          res.json({ success: true, discount });
                        } else {
                          return res.json({
                            error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
                          });
                        }
                      }
                    }
                }
            }else{
              return res.json({error:"No such coupon found"})
            }
          }else{
              return res.json({error:"No Coupon found"});
          }
        }else{
          return res.json({error:"Coupon is expired"});
        }
      } catch (error) {
        console.log(error);
        res.json({ error: "Some error Occurred" });
      }
}

const orderlists=async(req,res)=>{
   const username = req.session.email;
    res.render("./user/orderLists");
}






module.exports = {
    toSignup,
    tologin,
    tohome,
    signup,
    otpsender,
    touserdash,
    userlogin,
    tologout,
    otpverify,
    getUserProductDetails,
    restpassword,
    forgotPwd,
    forgotPWDPost,
    getPasswordRecovery,
    forotp,
    passwordRecoveryPost,
    PasswordResendOtp,
    profiles,
    address,
    addaddressProfile,
    deleteAddress,
    edituserAddress,
    updateediteduserAddress,
    updateProfile,
    userPasswordReset,
    orderAddress,
    postOrderList,
    orderSuccess,
    orderHistory,
    cancelOrder,
    resendOtp,
    getcoupoun,
    postcoupoun,
    orderlists,
}