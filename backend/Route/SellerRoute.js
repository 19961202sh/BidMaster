const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const SellerControllers = require("../Controlers/SellerController");

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/"); // Make sure this directory exists
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

// Set up file filter to only allow certain image types
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        // Accept image files only
        cb(null, true);
    } else {
        // Reject non-image files
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Initialize upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    }
});

// Get all seller items
router.get("/", SellerControllers.getAllItems);

// Create new item (with image upload)
router.post("/", upload.single("image"), SellerControllers.addItem);

// Get by ID
router.get("/:id", SellerControllers.getById);

// Update item (with optional image upload)
router.put("/:id", upload.single("image"), SellerControllers.updateItem);

// Delete item
router.delete("/:id", SellerControllers.deleteItem);

module.exports = router;