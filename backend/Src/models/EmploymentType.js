const mongoose = require("mongoose");

const employmentTypeSchema = new mongoose.Schema(
  {
    contract: { type: String, required: true, unique: true },
    daily: { type: String },
    monthly: { type: String },
  },
  { timestamps: true }
);

const EmploymentType = mongoose.model("EmploymentType", employmentTypeSchema, "employment_types");

module.exports = EmploymentType; // Ensure it's correctly exported
