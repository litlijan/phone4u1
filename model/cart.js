const mongoose=require("mongoose")

const {Schema,objectId}=mongoose;
const CartSchema= new Schema({
    UserId: { type: Schema.Types.ObjectId},
    Items: [
      {
        ProductId: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        Quantity: {
          type: Number,
        },
      }
    ],
    TotalAmount: {
      type: Number,
    },
   
})
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;