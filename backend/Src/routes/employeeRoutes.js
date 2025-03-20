// routes/employee.js
const express = require("express");
const Employee = require("../models/Employee");
const upload = require("../middleware/upload");
const router = express.Router();
const EmploymentType = require("../models/EmploymentType");
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
// routes/employee.js
router.post("/add-employee", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { fullname, contact, address, status, employeeid, currentsalary } = req.body;

    // Debug received data
    console.log("Received data:", {
      fullname,
      contact, 
      address,
      status,
      employeeid,
      currentsalary
    });

    // Validate required fields
    if (!fullname || !contact || !address || !status || !employeeid || !currentsalary) {
      return res.status(400).json({ 
        message: "All fields except image are required",
        receivedData: req.body,
        missingFields: [
          !fullname ? "fullname" : null,
          !contact ? "contact" : null,
          !address ? "address" : null,
          !status ? "status" : null,
          !employeeid ? "employeeid" : null,
          !currentsalary ? "currentsalary" : null
        ].filter(Boolean)
      });
    }

    // Rest of the function...
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
router.put("/employee/:id", upload.single("image"), async (req, res) => {
  try {
    const { fullname, contact, address, status, employeeid, currentsalary } = req.body;
    
    // Prepare update object
    const updateData = {
      fullname,
      contact,
      address,
      status,
      employeeid,
      currentsalary: Number(currentsalary)
    };

    // Update image if a new one is uploaded
    if (req.file) {
      updateData.image = `/public/assets/${req.file.filename}`;
      
      // Delete old image if exists
      const employee = await Employee.findById(req.params.id);
      if (employee && employee.image) {
        const oldImagePath = path.join(__dirname, '..', employee.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
router.get("/employment-types", async (req, res) => {
  try {
    const types = await EmploymentType.find();
    if (!types || types.length === 0) {
      return res.status(404).json({ message: "No employment types found" });
    }
    res.status(200).json({ types }); // Wrapped response for better frontend handling
  } catch (error) {
    console.error("Error fetching employment types:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;