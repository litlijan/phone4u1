const brand = require("../model/brandSchema")
const flash = require("express-flash")
const mongoose = require("mongoose")

module.exports = {

    getAddBrand: (req, res) => {

        res.render("./admin/addBrand", { messages: req.flash() })
        
    },
    addBrand: async (req, res) => {

        try {
            const name = req.body.name;
            const brands = await brand.findOne({ name: name })
            if (brands) {

                req.flash("error", "Brand already exists")
                res.redirect("/admin/addBrand")
            } else {
                await brand.create(req.body)
                res.redirect("/admin/brand")
            }
        } catch (error) {
            console.log(error)
        }
    },
    getBrand: async (req, res) => {

      try {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 5; 
        const skip = (page - 1) * perPage;
        const brands = await brand.find({}).sort({ name: 1 }).skip(skip).limit(perPage);
        const totalCount = await brand.countDocuments();
        res.render("./admin/brand", {
            brands,

            currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        });
      } catch (error) {
        console.log(error);
      }
    },
    deleteBrand: async (req, res) => {
        try {
            const { id } = req.params
        const delBrand = await brand.findOneAndDelete({ _id: id })
        res.redirect("/admin/brand")
        } catch (error) {
            console.log(error);
        }
    },
    editBrand: async (req, res) => {
       try {
        const { id } = req.params
        const editBrand = await brand.findById({ _id: id })
        res.render("./admin/editBrand", { editBrand })
       } catch (error) {
        console.log(error);
       }
    },
    editedBrand: async (req, res) => {
       try {
        const { id } = req.params
        console.log(id)
        const { name } = req.body
        const brandUpdate = await brand.findByIdAndUpdate({ _id: id }, { name: name })
        res.redirect("/admin/brand",)
       } catch (error) {
        console.log(error);
       }
    }


}