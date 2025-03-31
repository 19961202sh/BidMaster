// models/employeeModel.js
const mongoose = require("mongoose");

const employeeDetailsSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  salary: Number,
  role: String,
  department: String,
  task: String,
  imagePath: {
    type: String,  // To store the path of the uploaded image
  },
});

module.exports = mongoose.model("EmpDetailsModel", employeeDetailsSchema);
