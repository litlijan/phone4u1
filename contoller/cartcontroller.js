const bcrypt = require('bcrypt')
const Cart = require('../model/cart')
const user = require('../model/user')
const mongoose = require('../model/cart')
const product = require('../model/product')
const brand = require('../model/brandSchema')
const category = require('../model/category')

const getcart = async (req, res) => {
  const userEmail = req.session?.email;
  const productId = req.body?.productid;
  req.session.totalPrice = req.body.totalPrice
  try {
    const users = await user.find({ email: userEmail });
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userId = users[0]._id; 

    let cartexist = await Cart.findOne({ UserId: userId });


    if (cartexist) {
      const existingCart = cartexist.Items.filter((item) =>
        item.ProductId.equals(productId)

      );
      if (existingCart?.length > 0) {
        existingCart[0].Quantity += 1;
      }
      else{
        cartexist.Items.push({ ProductId: productId, Quantity: 1 });
      }
      await cartexist.save();
      return res.json({ success: true, message: 'existing item' });
    } else {
      cartexist = new Cart({
        UserId: userId,
        Items: [{ ProductId: productId, Quantity: 1 }],
        
      });
      await cartexist.save();
      return res.json({ success: true, message: 'new item' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const cart = async (req, res) => {
  
  try {

    const userEamail = req.session.email;

    
    const users = await user.findOne({ email: userEamail });
    const cart = await Cart.findOne({ UserId: users._id }).populate("Items.ProductId");
    
    res.render("./user/cart", { users, cart });
  } catch (err) {
    console.log(' Error in cart section ', err);
  }

}
const removeFromCart = async (req, res) => {
  try {
    const userId = req.session.email;
    const users = await user.findOne({ email: userId });
    console.log(users);
    const productId = req.params._id;
    

    const updatedCart = await Cart.updateOne(
      { UserId:users._id },
      { $pull: { Items: { ProductId: productId} } },
      { new: true }
    );
    
    console.log(productId);
    
    res.redirect("/user/cart")
  } catch (error) {
    console.log("some  problems ",error)
  }
}
const updatingQuantity = async (req, res) => {
  try {
    
    const { productId, change } = req.body;
    const email = req.session.email;
    const userrr = await user.findOne({ email: email });
    const userCart = await Cart.findOne({ UserId: userrr._id });
    const products = await product.findById(productId);
    if (!userCart || !products) {
      return res.status(404).json({ error: "Product or cart not found" });
    }
    const cartItem = userCart.Items.find((item) =>
      item.ProductId.equals(productId)
    );
    if (!cartItem) {
      return res.status(404).json({ error: "Product or cart not found" });
    }
    const newQuantity = cartItem.Quantity + parseInt(change);
   
    if (newQuantity <= 0) {
     
      userCart.Items = userCart.Items.filter(
        (item) => !item.ProductId.equals(productId)
      );
    
    } else {
      cartItem.Quantity = newQuantity;
     
    }
    if (userCart.Items.length === 0) {
      await userCart.remove();
      return res.json({ message: "Cart is empty", cart: null });
    }

    await userCart.save();
    res.json({ message: "Quantity updated successfully", newQuantity });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const postcart = async (req, res) => {
  try {


    const UserId = req.session.email;
    
    req.session.totalPrice = parseInt(req.body.totalPrice);
    res.locals.totalPrice=res.session.totalPrice

    const cart = await Cart.findOneAndUpdate(
      { UserId: UserId.trim() },
      { $set: { Total: req.session.totalPrice } },
      { new: true }
    );
    

    res.json({ success: true});

  } catch (err) {
    console.log('err')
  }
}

const PlaceOrder = async (req, res) => {
try {
  let  total=req.query.data;
  
  req.session.total=total
  if(req.session.discount!=null||undefined)
  {
    req.session.total=total-req.session.discount;
    total=req.session.total;
  }

  const userId = req.session.email;
  const users = await user.findOne({email:userId});
  const cart = await Cart.findOne({ UserId: users}).populate(
    "Items.ProductId"
  );
  const quantity = cart.Items[0].Quantity;
  const product = cart.Items[0].ProductId;
  const productName = product.name;

  if (!cart) {
    res.redirect("/cart");
  
  } else {
    res.render("user/checkout", { users,cart,total,quantity,productName});
  }
} catch (error) {
  console.log(error);
}
};



module.exports = {
  cart,
  getcart,
  removeFromCart,
  updatingQuantity,
  PlaceOrder,
  postcart,
  
}