// models/Employee.js
const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true },
  employeeid: { type: String, required: true, unique: true },
  currentsalary: { type: Number, required: true },
  image: { type: String }, // Store image URL path
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);