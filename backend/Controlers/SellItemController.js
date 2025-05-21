const SellerItem = require("../Model/SellerItem");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/item';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Set up multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// GET all items
const getAllItems = async (req, res) => {
  try {
    const items = await SellerItem.find().sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching items", error: err.message });
  }
};

// POST create new item with image upload
const createItem = async (req, res) => {
  try {
    // Check if image exists
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create image URL for storage in DB
    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    
    // Create new item
    const newItem = new SellerItem({
      title: req.body.title,
      description: req.body.description,
      startingBid: req.body.startingBid,
      image: imageUrl,
      
      // Add seller reference if you have authentication
      // seller: req.user._id
    });

    // Save item
    const savedItem = await newItem.save();
    res.status(201).json({ 
      message: "Item created successfully", 
      item: savedItem 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating item", error: err.message });
  }
};

// GET single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await SellerItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching item", error: err.message });
  }
};

// PUT update item
const UpdateItem = async (req, res) => {
  try {
    const updatedItem = await SellerItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ 
      message: "Item updated successfully", 
      item: updatedItem 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating item", error: err.message });
  }
};

// DELETE item
const deleteItem = async (req, res) => {
  try {
    const item = await SellerItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Delete image file if exists
    if (item.image) {
      const imagePath = item.image.replace(`${req.protocol}://${req.get('host')}/`, '');
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await SellerItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
  UpdateItem,
  deleteItem,
  upload // Export the multer middleware
};