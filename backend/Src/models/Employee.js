const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeid: { type: String, unique: true, default: () => `EMP-${Date.now()}` }, // Auto-generate unique ID
    fullname: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, enum: ["active", "inactive", "on_leave"] },
    
    // Store employeeType as ObjectId (Reference)
    employeeType: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeType", required: true },
    
    currentsalary: { type: Number, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema, "employees");
