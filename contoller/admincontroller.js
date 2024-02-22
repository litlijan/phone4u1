const category = require('../model/category');
const user = require('../model/user');
const { ObjectId } = require('mongodb')
const adminRegister = require('../model/admin')
const bcrypt = require('bcrypt')
const brand = require("../model/brandSchema")
const adminModel = require('../model/admin');
const product = require('../model/product');
const Order =require('../model/order')
const { name } = require('ejs');
const moment=require("moment")
const pdf = require("../utility/salespdf");
// const { default: orders } = require('razorpay/dist/types/orders');



const toadmin = (req, res) => {
  res.render('./admin/adminlogin')
}

const admin = async (req, res) => {
  console.log(req.body);

  try {
    const { name, password, email } = req.body;

    const userRegister = await adminModel.findOne({ email: email })

    if (!userRegister) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userRegister.password);
    console.log("passCheck", isMatch)
    if (!(isMatch)) {
      console.log("Invalid Password");
      return res.render('./admin/adminlogin')
    } else {
      req.session.adminLogin = true;
      req.session.adminId = userRegister._id;
      res.redirect('/admin/admindashboard')
    }
  } catch (error) {
    console.error('error while admin login:', error)
  }


}
const toadmindashboard = async (req, res) => {
 try {
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const skip = (page - 1) * perPage;
  const brands = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
  const totalCount = await brand.countDocuments();
  res.render("./admin/admindashboard", {
    brands,

    currentPage: page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  });
 } catch (error) {
  console.log(error);
 }
}

//get for usermangement
const usermanagement = async (req, res) => {
  try {
    var i = 0
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const skip = (page - 1) * perPage;
  const userss = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
  const totalCount = await brand.countDocuments();
  const userData = await user.find().sort({ username: 1, email: 1, status: 1 })
  res.render('./admin/usermangerment', {
    userData, i, userss,

    currentPage: page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  })
  } catch (error) {
    console.log(error);
  }
}

//post method for userblock
const userBlock = async (req, res) => {
  const id = req.params.id
  const block = await user.updateOne({ _id: id }, { $set: { status: false } })
  return res.redirect('/admin/mangeuser')
}

//post method for userblock
const unBlock = async (req, res) => {
try {
  const userId = req.params.userId;
  const unblocks = await user.updateOne({ _id: userId }, { status: true });
  return res.redirect('/admin/mangeuser')
} catch (error) {
  console.log(error);
}
  
}




const BlockandUnblock = async (req, res) => {
  try {
    const userId = req.params.userId;
    const UserReg = await user.findOne({ _id: userId })

    console.log(userId)
    if (UserReg.status) {
      const Block = await user.updateOne({ _id: userId }, { status: false });
    }


    res.redirect('/admin/mangeuser')
  } catch (error) {
    console.error('error while blocking the user:', error)
  }
}


// Category GET
const tocategory = async (req, res) => {
  try {
    const title = "category"
  var i = 0
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const skip = (page - 1) * perPage;
  const cate = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
  const totalCount = await brand.countDocuments();

  const categoryData = await category.find().sort({ name: 1, date: 1, status: 1, stock: 1 })
  res.render('./admin/category', {
    title, i, categoryData, cate,

    currentPage: page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  })
  } catch (error) {
    console.log(error);
  }
}

const postaddcategory = async (req, res) => {

try {
  const categories = {
    name: req.body.name,
  }

  await new category(categories).save()

  res.redirect('/admin/category')
} catch (error) {
  console.log(error);
}



}
const addcategory = async (req, res) => {
  res.render('./admin/addcategory')
}

const toproduct = async (req, res) => {
  console.log('@@@@@');
  try {

    const products = await product.find()
    console.log("..........................................................");
    res.render('./admin/product', { productData: products })
  } catch (error) {
    console.error('error while rendering the profile page:', error)
  }

}
const editCategory = async (req, res) => {
  const { id } = req.params
  const editCategory = await category.findById({ _id: id })
  res.render("./admin/editCategory", { editCategory })
}

const editedCategory = async (req, res) => {
  try {
    const { id } = req.params
  const { name } = req.body
  const categoryname = name.trim()
  const catUpdate = await category.findByIdAndUpdate({ _id: id }, { name: categoryname })
  res.redirect("/admin/category")
  } catch (error) {
    console.log(error);
  }
  
}

const disableandenable = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(req.params);
    const UserReg = await category.findOne({ _id: userId })

    if (UserReg.status) {
      const Block = await category.updateOne({ _id: userId }, { status: false });
    }


    res.redirect('/admin/category')
  } catch (error) {
    console.error('error while blocking the user:', error)
  }
}

const enable = async (req, res) => {
try {
  const userId = req.params.userId;
  const unblocks = await category.updateOne({ _id: userId }, { status: true });
  return res.redirect('/admin/category')
} catch (error) {
  console.log(error);
}
 
}

const getcount=async(req,res)=>{
  try {
    const orders = await Order.find({
      Status: {
        $nin:["returned","Cancelled","Rejected"]
      }
    });
    const orderCountsByDay = {};
    const totalAmountByDay = {};
    const orderCountsByMonthYear = {};
    const totalAmountByMonthYear = {};
    const orderCountsByYear = {};
    const totalAmountByYear = {};
    let labelsByCount;
    let labelsByAmount;  
    orders.forEach((order) => {
      const orderDate = moment(order.OrderDate, "M/D/YYYY, h:mm:ss A");
      const dayMonthYear = orderDate.format("YYYY-MM-DD");
      const monthYear = orderDate.format("YYYY-MM");
      const year = orderDate.format("YYYY");

      if(req.url==="/count-orders-by-day")
      {
        if(!orderCountsByDay[dayMonthYear])
        {
          orderCountsByDay[dayMonthYear] = 1;
          totalAmountByDay[dayMonthYear] = order.total
        }
        else{
          orderCountsByDay[dayMonthYear] ++;
          totalAmountByDay[dayMonthYear] += order.total

        }
        const ordersByDay = Object.keys(orderCountsByDay).map(
          (dayMonthYear) => ({
            _id: dayMonthYear,
            count: orderCountsByDay[dayMonthYear],
          })
        );

        const amountsByDay = Object.keys(totalAmountByDay).map(
          (dayMonthYear)=>({
            _id: dayMonthYear,
            total: totalAmountByDay[dayMonthYear],
          })

        )
        amountsByDay.sort((a, b) => (a._id > b._id ? -1 : 1));
        ordersByDay.sort((a, b) => (a._id > b._id ? -1 : 1));

        labelsByCount = ordersByDay.map((entry) =>
        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
      );

      labelsByAmount = amountsByDay.map((entry) =>
        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
      );

      dataByCount = ordersByDay.map((entry) => entry.count);
      dataByAmount = amountsByDay.map((entry) => entry.total);

      }else if (req.url === "/count-orders-by-month") {
        if (!orderCountsByMonthYear[monthYear]) {
          orderCountsByMonthYear[monthYear] = 1;
          totalAmountByMonthYear[monthYear] = order.total;
        } else {
          orderCountsByMonthYear[monthYear]++;
          totalAmountByMonthYear[monthYear] += order.total;
        }
      
        const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
          (monthYear) => ({
            _id: monthYear,
            count: orderCountsByMonthYear[monthYear],
          })
        );
        const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
          (monthYear) => ({
            _id: monthYear,
            total: totalAmountByMonthYear[monthYear],
          })
        );
       
      
        ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
        amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
      
        labelsByCount = ordersByMonth.map((entry) =>
          moment(entry._id, "YYYY-MM").format("MMM YYYY")
        );
        labelsByAmount = amountsByMonth.map((entry) =>
          moment(entry._id, "YYYY-MM").format("MMM YYYY")
        );
        dataByCount = ordersByMonth.map((entry) => entry.count);
        dataByAmount = amountsByMonth.map((entry) => entry.total);
      } else if (req.url === "/count-orders-by-year") {
        // Count orders by year
        if (!orderCountsByYear[year]) {
          orderCountsByYear[year] = 1;
          totalAmountByYear[year] = order.total;
        } else {
          orderCountsByYear[year]++;
          totalAmountByYear[year] += order.total;
        }
      
        const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
          _id: year,
          count: orderCountsByYear[year],
        }));
        const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
          _id: year,
          total: totalAmountByYear[year],
        }));
      
        ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
        amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
      
        labelsByCount = ordersByYear.map((entry) => entry._id);
        labelsByAmount = amountsByYear.map((entry) => entry._id);
        dataByCount = ordersByYear.map((entry) => entry.count);
        dataByAmount = amountsByYear.map((entry) => entry.total);
       
      }
    })
    res.json({ labelsByCount,labelsByAmount, dataByCount, dataByAmount });

}
catch(error)
{
 console.log(error);
}
}

const lastorderandbeast=async(req,res)=>{
  try {
 
    const latestOrders = await Order.find().sort({ _id: -1 }).limit(6);

  if (!latestOrders ) throw new Error("No Data Found");

  res.json({ latestOrders });
    
  } catch (error) {
    console.log(error)
  }
}

const genereatesalesReport=async(req,res)=>{
  try {
    const startDate = req.body.startDate
    const format = req.body.downloadFormat
    const endDate = req.body.endDate
    const orders = await Order.find({
      PaymentStatus: 'Paid',
    }).populate('Items.ProductId')

    
    const totalSales = await Order.aggregate([
      {
      $match:{
        PaymentStatus: 'Paid',
      }
  },
  {
    $group: {
      _id: null,
      totalSales: {$sum: '$TotalPrice'}
    }
  }
])
const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
pdf.downloadPdf(req,res,orders,startDate,endDate,totalSales)

  } catch (error) {
    console.log(error);
  }

}



module.exports = {
  toadmin,
  admin,
  toadmindashboard,
  usermanagement,
  unBlock,
  BlockandUnblock,
  tocategory,
  addcategory,
  postaddcategory,
  toproduct,
  editCategory,
  editedCategory,
  disableandenable,
  enable,
  getcount,
  lastorderandbeast,
  genereatesalesReport

}