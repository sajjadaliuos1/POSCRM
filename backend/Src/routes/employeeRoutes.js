// routes/employee.js
const express = require("express");
const Employee = require("../models/Employee");
const upload = require("../middleware/upload");
const router = express.Router();
const EmploymentType = require("../models/EmploymentType");
const EmployeeSalary = require("../models/EmployeeSalary");
const path = require("path");
const fs = require("fs"); 
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
/////////////update employee status//////
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
    console.log("🔥 Received body:", req.body);
    console.log("🔥 Received file:", req.file);

    // Trim all keys in req.body to remove any accidental spaces
    Object.keys(req.body).forEach((key) => {
      req.body[key.trim()] = req.body[key]; 
      if (key !== key.trim()) {
        delete req.body[key]; // Remove the incorrectly spaced key
      }
    });

    const { fullname, contact, address, status, employeeType, currentsalary } = req.body;
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

    // Find employee by ID
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee details
    employee.fullname = fullname;
    employee.contact = contact;
    employee.address = address;
    employee.status = status;
    employee.employeeType = employeeType;
    employee.currentsalary = currentsalaryNumber;
    if (image) {
      employee.image = image;
    }

    const updatedEmployee = await employee.save();
    console.log("✅ Successfully updated employee:", updatedEmployee);

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//////get employee images////
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
    const imagePath = path.resolve(__dirname, '../../public/assets', imageRecord.image);
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
      const imagePath = path.join(__dirname, '..', employee.image);
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

/////////employee types////
router.get("/employee-types", async (req, res) => {
  try {
    const employeeTypes = await EmploymentType.find({}, { type: 1, description: 1 });
    res.json(employeeTypes);
  } catch (error) {
    console.error("Error fetching employee types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;