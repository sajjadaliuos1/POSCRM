require("dotenv").config();
const express = require("express");
const connectDB = require("./Src/db/Config");
const path = require("path");
const employeeRoutes = require("./Src/routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/public", express.static(path.join(__dirname, "public/assets")));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/employees', employeeRoutes); // ✅ Corrected route import

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
