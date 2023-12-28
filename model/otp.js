const mongoose=require('mongoose')
require('dotenv').config()

const otpSchema = new mongoose.Schema({
    otp:{type:Number},
    email:{type:String},
    createdAt:{type:Date},
    expireAt:{type:Date},
})

const otp = mongoose.model('otp',otpSchema)
module.exports = otp