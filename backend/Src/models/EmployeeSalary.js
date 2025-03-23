const mongoose = require("mongoose");
const Counter = require("./Counter"); // Import the Counter model

const EmployeeSalarySchema = new mongoose.Schema(
  {
    employee_salary_id: { type: Number, unique: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    amount_in: { type: Number, default: 0 },
    amount_out: { type: Number, default: 0 },
    amount_remaining: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Function to get the next sequence for employee_salary_id
async function getNextSequence(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create a new counter if it doesn't exist
  );
  return counter.sequence_value;
}

// Auto-increment before saving
EmployeeSalarySchema.pre("save", async function (next) {
  if (!this.employee_salary_id) {
    this.employee_salary_id = await getNextSequence("employee_salary_id");
  }
  next();
});

const EmployeeSalary = mongoose.model("EmployeeSalary", EmployeeSalarySchema, "employee_salary");

module.exports = EmployeeSalary;
