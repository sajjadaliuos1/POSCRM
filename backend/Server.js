require("dotenv").config();
const express = require("express");
const connectDB = require("./Src/db/Config");
const path = require("path");
const employeeRoutes = require("./Src/routes/employeeRoutes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/public", express.static(path.join(__dirname, "public/assets")));

// Connect to MongoDB
connectDB();
// ✅ Enable CORS for all origins
app.use(cors());

// ✅ OR: Restrict to specific origin (Recommended for security)
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
// API Routes
app.use('/api', employeeRoutes); // ✅ Corrected route import

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
