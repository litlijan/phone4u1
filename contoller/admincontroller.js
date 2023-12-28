const category = require('../model/category');
const user = require('../model/user');
const { ObjectId } = require('mongodb')
const adminRegister = require('../model/admin')
const bcrypt = require('bcrypt')
const brand = require("../model/brandSchema")
const adminModel = require('../model/admin');
const product = require('../model/product');
const { name } = require('ejs');



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
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const skip = (page - 1) * perPage;
  const brands = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
  const totalCount = await brand.countDocuments();
  console.log('........................');
  res.render("./admin/admindashboard", {
    brands,

    currentPage: page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  });
}

//get for usermangement
const usermanagement = async (req, res) => {
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
}

//post method for userblock
const userBlock = async (req, res) => {
  const id = req.params.id
  const block = await user.updateOne({ _id: id }, { $set: { status: false } })
  return res.redirect('/admin/mangeuser')
}

//post method for userblock
const unBlock = async (req, res) => {
  const userId = req.params.userId;
  const unblocks = await user.updateOne({ _id: userId }, { status: true });
  return res.redirect('/admin/mangeuser')
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
}

const postaddcategory = async (req, res) => {

  // console.log(name)

  const categories = {
    name: req.body.name,
    // description: req.body.description,
    // stock: req.body.stock,
    // image: '/category/${req.files[0].filename}',
    // image: req.files.map((file) => '/photos/'+file.filename),
    // date: Date.now()

  }

  await new category(categories).save()

  res.redirect('/admin/category')

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
  const { id } = req.params
  const { name } = req.body
  const categoryname = name.trim()
  const catUpdate = await category.findByIdAndUpdate({ _id: id }, { name: categoryname })
  res.redirect("/admin/category")
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

  const userId = req.params.userId;
  const unblocks = await category.updateOne({ _id: userId }, { status: true });
  return res.redirect('/admin/category')
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

}