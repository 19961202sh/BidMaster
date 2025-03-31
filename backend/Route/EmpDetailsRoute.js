// routes/employeeRoutes.js
const express = require("express");
const multer = require("multer");
const employeeController = require("../Controlers/EmpDetailsControl");


const router = express.Router();

// Set up multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Specify the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename
  },
});

const upload = multer({ storage });

// Route to get employee by ID
router.get("/:id", employeeController.getEmployeeById);

// Route to handle image upload
router.post("/:id/upload", upload.single("image"), employeeController.uploadImage);

module.exports = router;
