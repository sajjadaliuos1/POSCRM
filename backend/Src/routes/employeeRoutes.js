const express = require("express");
const Employee = require("../models/Employee");
const upload = require("../middleware/upload"); // Import Multer middleware
const EmploymentType = require("../models/EmploymentType"); 
const router = express.Router();

// POST API - Create a new employee with image upload
router.post("/add-employee", upload.single("image"), async (req, res) => {  // ✅ Fixed missing "/"
  try {
    const { fullname, contact, address, status, employeeid, currentsalary } = req.body;

    // Validate required fields
    if (!fullname || !contact || !address || !status || !employeeid || !currentsalary) {
      return res.status(400).json({ message: "All fields except image are required" });
    }

    // Get image path if uploaded
    let imagePath = "";
    if (req.file) {
      imagePath = `/public/assets/${req.file.filename}`; // ✅ Fix: Public folder referenced properly
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ employeeid });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this ID already exists" });
    }

    // Create new employee
    const newEmployee = new Employee({
      fullname,
      contact,
      address,
      status,
      employeeid,
      currentsalary,
      image: imagePath,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  ////////// GET API - Fetch Employment Types
  router.get("/employment-types", async (req, res) => { 
    try {
      const types = await EmploymentType.find();
      if (!types || types.length === 0) {
        return res.status(404).json({ message: "No employment types found" });
      }
      res.status(200).json(types); // ✅ Send only the array, not wrapped in { data: types }
    } catch (error) {
      console.error("Error fetching employment types:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
 
  
module.exports = router;
