import dotenv from 'dotenv';
import express from 'express';
import connectDB from './Src/db/Config.js';
import path from 'path';
import employeeRoutes from './Src/routes/employeeRoutes.js';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Configure dotenv
dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/public", express.static(path.join(__dirname, "../public/assets")));

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

// API Routes
app.use('/api', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "An unexpected error occurred", 
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});