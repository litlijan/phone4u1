const mongoose=require("mongoose")
require('../config/dbconfig')
require('dotenv').config()

const catgorySchema=new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    date:{type:Date,default:Date.now()},
    stock :{type:Number},
    status:{type:Boolean,default:true}
});

const category=mongoose.model('category',catgorySchema)
module.exports=category;