// models/EmploymentType.js
const mongoose = require("mongoose");

const EmploymentTypeSchema = new mongoose.Schema({
  daily: { type: String },
  monthly: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("EmploymentType", EmploymentTypeSchema,'employment_types');