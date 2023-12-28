const product = require('../model/product')
const category = require('../model/category')
const brand = require("../model/brandSchema")
const moment = require("moment")
const flash = require("express-flash")
// Product GET
const product_get = async (req, res) => {
    const title = "product"
    var i = 0
    const page = parseInt(req.query.page) || 1; 
    const perPage = 5; 
        const skip = (page - 1) * perPage;
        const pro = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
        const totalCount = await brand.countDocuments();
    const productData = await product.find().populate('brand').populate('category')
    res.render('./admin/product', { title, i, productData,pro,

        currentPage: page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage), })
}

//  Add product GET

const addproduct_get = async (req, res) => {

    try {
        const brands = await brand.find({}).sort({ name: 1 })
        const categoryData = await category.find()
        console.log("///////", categoryData);
        res.render("./admin/addproduct", { brands, categoryData })

        // const title="product"

        // const categoryData=await category.find()
        // res.render('./admin/addproduct',{title,categoryData})
    } catch (error) {
        console.log(error);
    }
}

// Add product POST
const addproduct_post = async (req, res) => {
    // const{title,brand,category,description,price,quantity,color,size}=req.body
    // const images=req.files

    // const exist_product=await  product.findOne({title:title})
    try {
        const images = []
        const newCategory = await category.findOne({ name: req.body.category })
        console.log(newCategory);
        const newBrand = await brand.findOne({ name: req.body.brand })
        console.log(newBrand, '#######');
        for (let i = 1; i <= 4; i++) {
            const fieldName = `image${i}`;
            if (req.files[fieldName] && req.files[fieldName][0]) {
                images.push(req.files[fieldName][0].filename);
            }
        }
        let status
        let display
        if (req.body.stock <= 0) {
            status = "Out of Stock";
        } else {
            status = "In Stock";
        }
        const newProduct = new product({
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            brand: newBrand._id,
            tags: req.body.tags,
            stock: req.body.stock,
            category: newCategory._id,
            status: status,
            display: "Active",
            updatedOn: moment(new Date()).format("llll"),
            images: images,
        });
        await newProduct.save()
        // req.flash("success", "Product is Added Successfully");
        res.redirect("/admin/Product");
    } catch (error) {
        console.log(error);
    }
    //   {
    //   res.redirect('/admin/product')

    // }
    // const  addproduct_post= async (req, res) => {
    //   res.render('./admin/addproduct')
    // }

    // if(exist_product){
    //     res.redirect('/admin/product?message=This product already exists')
    // }else{

    //     console.log(new_product)
    //     res.redirect('/admin/product')
    // }

}
const getBlockProduct = async (req, res) => {
    try {
        const { id } = req.params
        const selectedProduct = await product.findOne({ _id: id })
        if (selectedProduct.display === "Active") {
            const updateProduct = await product.findByIdAndUpdate({ _id: id }, { display: "Blocked" })
        } else if (selectedProduct.display === "Blocked") {
            const updateProduct = await product.findByIdAndUpdate({ _id: id }, { display: "Active" })
        }
        res.redirect("/admin/product")
    } catch (error) {
        console.log(error)
    }
}
const productDetails = async (req, res) => {

    try {
        const { id } = req.params
        const productToDisplay = await product.findOne({ _id: id }).populate('brand category')
        // console.log(productToDisplay);
        res.render("./admin/productDetails", { productToDisplay })
    } catch (error) {
        console.log(error)
    }
}

const editGetProduct = async (req, res) => {
    try {
        const { id } = req.params
        const brands = await brand.find()
        const categorys = await category.find()
        const editProduct = await product.findOne({ _id: id }).populate('brand category')
        res.render("./admin/editProduct", { editProduct, brands, categorys })
    } catch (error) {
        console.log(error);
    }
}
const postEditProduct = async (req, res) => {
    try {
        const { id } = req.params
        let images = []
        for (let i = 0; i <= 3; i++) {
            const fieldName = `image${i + 1}`;
            if (req.files[fieldName] && req.files[fieldName][0]) {
                images[i] = req.files[fieldName][0].filename;
                const upload = await product.findByIdAndUpdate({ _id: id }, { $set: { [`images.${i}`]: images[i] } })
            }
        }
        let status
        let display
        if (req.body.stock > 0) {
            status = "In Stock"
        } else {
            status = "Out Of Stock"
        }
        const brands = await brand.findOne({ name: req.body.brand })
        const categorys = await category.findOne({ name: req.body.category })
        const editProduct = await product.findOne({ _id: id })
        req.body.brand = brands._id;
        req.body.category = categorys._id
        const result = await product.findByIdAndUpdate({ _id: id }, req.body)
        const stocks = await product.findByIdAndUpdate({ _id: id }, { $set: { status: status } })
        res.redirect("/admin/product")
    } catch (error) {
        console.log(error);
    }
}

const cancelProduct = async (req, res) => {
    try {
        res.redirect("/admin/product")

    } catch (error) {
        console.log(error);

    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const delProduct = await product.findOneAndDelete({ _id: id })
        req.flash("error", "Are you want to delete the product")
        res.redirect("/admin/product")

    } catch (error) {
        console.log(error);

    }
}

const deleteimage=async(req,res)=>
{
    try{
        console.log('1234567890')
        const id=req.params.id
        console.log(id,'ppppppppppppppppppppppppppp')
        const imageIndex=req.params.index
        console.log(imageIndex,"imageeeeeeee inddddddddddddddddd");
        const productimage=await product.findById(id)
        console.log(productimage,"ddddddddddddddddd");
        if(!productimage){
            res.status(404).json({success:false,message:"prouduct not found"})
            return
        }
        var img=productimage.images.splice(imageIndex, 1);
        // console.log(img,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        console.log(img,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        await productimage.save();
        res.status(200).json({success:true,message:"image deleted successfully"})
    
    }catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({success:false,message:'Failed to delete image'});
    }

}

module.exports = {
    product_get,
    addproduct_get,
    addproduct_post,
    getBlockProduct,
    productDetails,
    editGetProduct,
    postEditProduct,
    cancelProduct,
    deleteProduct,
    deleteimage,
}