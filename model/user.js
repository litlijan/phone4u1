const mongoose=require('mongoose')

require('dotenv').config()

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,

    },
    phonenumber:{
        type:Number
    },
    Access: {
        type: String,
        enum: [ 'block', 'unblock' ]
    },
    date:{
        type:Date,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    status: {
    type: Boolean,
    default: true, 
  },
  DiscountAmount: {
    type: Number,
  },
  AvailableQuantity: {
    type: Number,
    default: 0,
    // required: true,
  },
  timeStamp: { type: Date },
  profilePhoto: { type: String },
  phone: {
    type: String,
    // required: true
  },
  Address: [
    {
      Name: { type: String },
      AddressLane: { type: String },
      City: { type: String },
      Pincode: { type: Number },
      State: { type: String },
      Mobile: { type: Number },
    },
  ],
})
const user=mongoose.model('user',userSchema)
module.exports=user