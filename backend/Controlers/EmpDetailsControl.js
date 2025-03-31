// controllers/employeeController.js
const Employee = require("../Model/EmpModel");
const path = require("path");

// Handle uploading an image
exports.uploadImage = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Generate image URL (e.g., store it in 'uploads/' folder)
    const imageUrl = path.join("uploads", file.filename);

    // Update employee record with the image path
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { imagePath: imageUrl },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({
      message: "Image uploaded successfully.",
      imagePath: updatedEmployee.imagePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
