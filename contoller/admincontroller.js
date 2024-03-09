const category = require('../model/category');
const user = require('../model/user');
const { ObjectId } = require('mongodb')
const adminRegister = require('../model/admin')
const bcrypt = require('bcrypt')
const flash = require("express-flash")
const brand = require("../model/brandSchema")
const adminModel = require('../model/admin');
const product = require('../model/product');
const Order = require('../model/order')
const Banner = require('../model/bannerSchema')
const { name } = require('ejs');
const moment = require("moment")
const pdf = require("../utility/salespdf");




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


const userBlock = async (req, res) => {
  const id = req.params.id
  const block = await user.updateOne({ _id: id }, { $set: { status: false } })
  return res.redirect('/admin/mangeuser')
}


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
 
  try {

    const products = await product.find()

    res.render('./admin/product', { productData: products })
  } catch (error) {
    console.error('error while rendering the profile page:', error)
  }

}
const editCategory = async (req, res) => {
  const { id } = req.params
  const editCategory = await category.findById({ _id: id })
  res.render("./admin/editCategory", { editCategory})
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

const getcount = async (req, res) => {
  try {
    let aggregationPipeline = [];
    
    if (req.url === "/count-orders-by-day") {
      aggregationPipeline.push(
        {
          $match: {
            Status: {
              $nin: ["returned", "Cancelled", "Rejected"]
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$OrderDate" } },
            count: { $sum: 1 },
            total: { $sum: "$total" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      );
    } else if (req.url === "/count-orders-by-month") {
      aggregationPipeline.push(
        {
          $match: {
            Status: {
              $nin: ["returned", "Cancelled", "Rejected"]
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$OrderDate" } },
            count: { $sum: 1 },
            total: { $sum: "$total" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      );
    } else if (req.url === "/count-orders-by-year") {
      aggregationPipeline.push(
        {
          $match: {
            Status: {
              $nin: ["returned", "Cancelled", "Rejected"]
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$OrderDate" } },
            count: { $sum: 1 },
            total: { $sum: "$total" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      );
    }

    const result = await Order.aggregate(aggregationPipeline);

    const labelsByCount = result.map(entry => {
      if (req.url === "/count-orders-by-day") {
        return moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY");
      } else if (req.url === "/count-orders-by-month") {
        return moment(entry._id, "YYYY-MM").format("MMM YYYY");
      } else if (req.url === "/count-orders-by-year") {
        return entry._id;
      }
    });

    const dataByCount = result.map(entry => entry.count);
    const dataByAmount = result.map(entry => entry.total);

    res.json({ labelsByCount, dataByCount, dataByAmount });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

const lastorderandbeast = async (req, res) => {
  try {

    const latestOrders = await Order.find().sort({ _id: -1 }).limit(6);

    const bestSeller = await Order.aggregate([
      
      { $unwind: "$Items" },
      
      {
        $group: {
          _id: "$Items.ProductId",
          totalSold: { $sum: "$Items.Quantity" }
        }
      },
      
      { $sort: { totalSold: -1 } },
      
      { $limit: 3 },
      
      {
        $lookup: {
          from: "product",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      
      { $unwind: "$productDetails" },
      
      {
        $project: {
          _id: 0,
          product_id: "$productDetails._id",
          productName: "$productDetails.name",
          Price: "$productDetails.price",
          status: "$productDetails.status",
          images:"$productDetails.images",
          totalSold: 1
        }
      }
    ])
    
    



    console.log(bestSeller, "000000000000000000000000000");




    if (!latestOrders || !bestSeller) throw new Error("No Data Found");

    res.json({ latestOrders, bestSeller });

  } catch (error) {
    console.log(error)
  }
}

const genereatesalesReport = async (req, res) => {
  try {
    const startDate = req.body.startDate
    const format = req.body.downloadFormat
    const endDate = req.body.endDate
    const orders = await Order.find({ PaymentStatus: 'Paid' }).populate('Items.ProductId');

    const startDate_Time = new Date(`${startDate}T00:00:00Z`);
const endDate_Time = new Date(`${endDate}T23:59:59Z`);

const totalSales = await Order.aggregate([
  {
    $match: {
      OrderDate: {
        $gte: startDate_Time,
        $lte: endDate_Time,
      },
    },
  },
  {
    $unwind: "$Items" 
  },
  {
    $lookup: {
      from: "product", 
      localField: "Items.ProductId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $unwind: "$product" 
  },
  {
    $group: {
      _id: "$_id",
      OrderId: { $first: "$randomOrderId" }, 
      OrderDate: { $first: "$OrderDate" }, 
      PaymentMethod: { $first: "$PaymentMethod" }, 
      totalOrderPrice: { 
        $sum: { 
          $multiply: ["$Items.Quantity", "$product.price"] 
        } 
      }
    }
  }
]);


    const newArray=totalSales
    newArray.forEach((value)=>{
      value.OrderDate=value.OrderDate.toLocaleDateString('en-GB')

    })
    
   
    const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
    pdf.downloadPdf(req, res, startDate, endDate,newArray)

  } catch (error) {
    console.log(error);
  }

}

const bannerManagement = async (req, res) => {
  try {
    const banners = await Banner.find()
    res.render("./admin/bannermanagement", { banners })

  } catch (error) {
    console.log(error);
  }
}

const bannerManagementpost = async (req, res) => {
  try {
  
    if (!req.file) {
      return res.status(400).send('Please upload an image.');
    }

    const { filename } = req.file;

    const newBanner = new Banner({
      title: req.body.title,
      image: filename,
    });
   

    await newBanner.save();

    res.redirect('/admin/bannerManagement')

  } catch (error) {
    console.log("error while uploading the banner:", error);
  }
}

const deletebannerManagement=async(req,res)=>{
  try {
    const bannerId = req.params.bannerId;
    await Banner.findByIdAndDelete(bannerId);
    res.redirect('/admin/bannerManagement');
} catch (error) {
    console.error('error while delete banner:',error)
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
  genereatesalesReport,
  bannerManagement,
  bannerManagementpost,
  deletebannerManagement

}