const mongoose = require("mongoose");

const EmployeeTypeSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  contract: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EmployeeType", EmployeeTypeSchema,'employment_types');
