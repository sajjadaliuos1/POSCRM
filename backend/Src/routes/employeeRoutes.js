import express from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import Employee from "../models/Employee.js";
import upload from "../middleware/upload.js";
import EmploymentType from "../models/EmploymentType.js";
import EmployeeSalary from "../models/EmployeeSalary.js";

const router = express.Router();

// Get all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new employee
router.post("/add-employee", upload.single("image"), async (req, res) => {
  try {
    console.log("🔥 Received body:", req.body);
    console.log("🔥 Received file:", req.file);

    const { fullname, contact, address, status, employeeType, currentsalary, employeeid } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!fullname || !contact || !address || !status || !employeeType || !currentsalary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert salary to a number
    const currentsalaryNumber = Number(currentsalary);
    if (isNaN(currentsalaryNumber)) {
      return res.status(400).json({ message: "Current salary must be a number" });
    }

    // Ensure employeeid is set
    const finalEmployeeId = employeeid || `EMP-${Date.now()}`;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ employeeid: finalEmployeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Create new employee record
    const newEmployee = new Employee({
      employeeid: finalEmployeeId,
      fullname,
      contact,
      address,
      status,
      employeeType,
      currentsalary: currentsalaryNumber,
      image,
    });

    const savedEmployee = await newEmployee.save();
    console.log("✅ Successfully saved employee:", savedEmployee);

    // Create salary record with auto-incremented employee_salary_id
    const newSalaryRecord = new EmployeeSalary({
      employee_id: savedEmployee._id,
      amount_in: 0,
      amount_out: 0,
      amount_remaining: 0, // Default to 0
    });

    await newSalaryRecord.save();
    console.log("✅ Employee Salary Entry Created:", newSalaryRecord);

    res.status(201).json({
      message: "Employee added successfully",
      employee: savedEmployee,
      salary: newSalaryRecord,
    });

  } catch (error) {
    console.error("❌ Error saving employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update employee status
router.put("/employees/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status field is required" });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "User not found" });
    }
    employee.status = status;
    await employee.save();
    res.json({ success: true, message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Get employee by ID
router.get("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee
router.put("/update-employee/:id", upload.single("image"), async (req, res) => {   
  try {       
    const id = req.params.id;
    console.log("Received ID:", id);
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);        

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const { fullname, contact, address, status, employeeType, currentsalary } = req.body;
    
    // Construct the update object
    const updateData = {
      fullname,
      contact,
      address,
      status,
      employeeType,
      currentsalary: Number(currentsalary), // Ensure it's a number
    };
    
    // Add image to updateData if a file was uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    // Update the employee in the database
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true // Run model validations
    });
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ 
      message: "Error updating employee", 
      error: error.message 
    });
  } 
});

// Get employee images
router.get("/img/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee by ID or employeeid
    const imageRecord = await Employee.findById(id);

    if (!imageRecord || !imageRecord.image) {
      console.error("No image found for ID:", id);
      return res.status(404).json({ message: "No image found" });
    }

    // Construct the correct image path
    const imagePath = path.resolve(process.cwd(), 'public/assets', imageRecord.image);
    console.log("Full Image Path:", imagePath);

    // Check if file exists before sending
    if (!fs.existsSync(imagePath)) {
      console.error("Image file does not exist:", imagePath);
      return res.status(404).json({ message: "Image file not found" });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Unable to fetch image", details: error.message });
  }
});

// Delete employee
router.delete("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    // Delete image if exists
    if (employee.image) {
      const imagePath = path.join(process.cwd(), 'public/assets', employee.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee types
router.get("/employee-types", async (req, res) => {
  try {
    const employeeTypes = await EmploymentType.find({}, { type: 1, description: 1 });
    res.json(employeeTypes);
  } catch (error) {
    console.error("Error fetching employee types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;