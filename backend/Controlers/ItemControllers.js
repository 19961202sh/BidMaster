const Item = require("../Model/ItemModel");
const fs = require('fs');
const path = require('path');

// Get all items
const getAllItems = async (req, res) => {
  let items;
  try {
    items = await Item.find().sort({ createdAt: -1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
  
  if (!items) {
    return res.status(404).json({ message: "No items found" });
  }
  
  return res.status(200).json(items);
};

// Add an item
const addItem = async (req, res) => {
  const { 
    id, name, description, price, startingPrice, biddingEndTime, status,
    condition, provenance, dimensions, weight, material, maker, year,
    authenticity, inspectionNotes, inspectionStatus
  } = req.body;
  
  // Get main image path from multer
  const imagePath = req.files && req.files.image && req.files.image[0] 
    ? `/uploads/${req.files.image[0].filename}` 
    : '/uploads/placeholder.png';
  
  // Handle additional images if they exist
  const additionalImages = [];
  if (req.files && req.files.additionalImages) {
    for (const file of req.files.additionalImages) {
      additionalImages.push(`/uploads/${file.filename}`);
    }
  }

  const newItem = new Item({
    id,
    name,
    description,
    price,
    image: imagePath,
    additionalImages,
    startingPrice: startingPrice || price, // Default to main price if not provided
    biddingEndTime: biddingEndTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
    // Item details
    condition: condition || 'Excellent',
    provenance: provenance || '',
    dimensions: dimensions || '',
    weight: weight || '',
    material: material || '',
    maker: maker || '',
    year: year || '',
    // Inspection fields
    authenticity: authenticity || 'Verified',
    inspectionNotes: inspectionNotes || '',
    inspectionStatus: inspectionStatus || 'Pending',
    status: status || (inspectionStatus === 'Approved' ? 'Approved' : 'Pending')
  });
  
  try {
    await newItem.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add item", error: err.message });
  }
  
  return res.status(201).json(newItem);
};

// Get item by ID
const getItemById = async (req, res) => {
  const id = req.params.id;
  
  let item;
  try {
    item = await Item.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
  
  if (!item) {
    return res.status(404).json({ message: "No item found" });
  }
  
  return res.status(200).json(item);
};

// Update item
const updateItem = async (req, res) => {
  const id = req.params.id;
  const { 
    name, description, price, startingPrice, biddingEndTime, status,
    condition, provenance, dimensions, weight, material, maker, year,
    authenticity, inspectionNotes, inspectionStatus
  } = req.body;
  
  let item;
  try {
    item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Update basic fields
    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.startingPrice = startingPrice || item.startingPrice || item.price;
    if (biddingEndTime) item.biddingEndTime = biddingEndTime;
    
    // Update Item detail fields
    item.condition = condition || item.condition;
    item.provenance = provenance !== undefined ? provenance : item.provenance;
    item.dimensions = dimensions !== undefined ? dimensions : item.dimensions;
    item.weight = weight !== undefined ? weight : item.weight;
    item.material = material !== undefined ? material : item.material;
    item.maker = maker !== undefined ? maker : item.maker;
    item.year = year !== undefined ? year : item.year;
    
    // Update inspection fields
    item.authenticity = authenticity || item.authenticity;
    item.inspectionNotes = inspectionNotes !== undefined ? inspectionNotes : item.inspectionNotes;
    item.inspectionStatus = inspectionStatus || item.inspectionStatus;
    
    // Set status based on inspection status if provided
    if (inspectionStatus) {
      item.status = inspectionStatus === 'Approved' ? 'Approved' : 'Pending';
    } else if (status) {
      item.status = status;
    }
    
    // If a new main image was uploaded, update the image path
    if (req.files && req.files.image && req.files.image[0]) {
      // Delete old image if it's not the placeholder
      if (item.image && item.image !== '/uploads/placeholder.png') {
        const oldImagePath = path.join(__dirname, '..', item.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      item.image = `/uploads/${req.files.image[0].filename}`;
    }
    
    // Handle additional images if they exist
    if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
      // Delete old additional images
      for (const imgPath of item.additionalImages) {
        const oldImgPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
      
      // Add new additional images
      item.additionalImages = [];
      for (const file of req.files.additionalImages) {
        item.additionalImages.push(`/uploads/${file.filename}`);
      }
    }
    
    await item.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
  
  return res.status(200).json(item);
};

// Delete item
const deleteItem = async (req, res) => {
  const id = req.params.id;
  
  try {
    const item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Delete main image if it's not the placeholder
    if (item.image && item.image !== '/uploads/placeholder.png') {
      const imagePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete additional images
    for (const imgPath of item.additionalImages) {
      const additionalImagePath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(additionalImagePath)) {
        fs.unlinkSync(additionalImagePath);
      }
    }
    
    await Item.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete item" });
  }
  
  return res.status(200).json({ message: "Item deleted successfully" });
};

// Update item status (for quick approval/rejection from ItemManager)
const updateItemStatus = async (req, res) => {
  const id = req.params.id;
  const { status, inspectionStatus } = req.body;
  
  try {
    const item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Update fields that were provided
    if (status) item.status = status;
    if (inspectionStatus) {
      item.inspectionStatus = inspectionStatus;
      // Also update the main status if inspection status is provided
      item.status = inspectionStatus === 'Approved' ? 'Approved' : 'Pending';
    }
    
    await item.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to update status" });
  }
  
  return res.status(200).json({ message: "Status updated successfully" });
};

exports.getAllItems = getAllItems;
exports.addItem = addItem;
exports.getItemById = getItemById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.updateItemStatus = updateItemStatus;