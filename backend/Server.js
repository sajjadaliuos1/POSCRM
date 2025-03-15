require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  const message = "Hello, Node.js!";
  res.send(message);
  console.log("Response sent:", message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
