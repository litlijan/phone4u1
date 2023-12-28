const mongoose = require("mongoose");
require("../config/dbconfig");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    default: "Active",
  },
});

const admin = mongoose.model('admin', adminSchema)

module.exports = admin;