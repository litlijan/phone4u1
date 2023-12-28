const user = require('../model/user')
const product = require('../model/product')
const brand = require('../model/brandSchema')
const category = require('../model/category')
const Order=require('../model/order')

const getorder=async(req,res)=>{
    const page = parseInt(req.query.page) || 1; 
        const perPage = 5; 
        const skip = (page - 1) * perPage;
        const order = await Order.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
        const totalCount = await Order.countDocuments();
        console.log('........................');
        res.render("./admin/order_list", {
            order,
            currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        });
}


module.exports={
    getorder,
}