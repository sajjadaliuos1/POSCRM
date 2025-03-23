const mongoose = require("mongoose");

// Counter schema to track auto-incrementing IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will be "employee_salary_id"
  sequence_value: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", CounterSchema, "counters");

module.exports = Counter;
