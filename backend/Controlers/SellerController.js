const mongoose = require('mongoose');
const fs = require('fs');
const Item = require('../Model/SellerItem');

// Get all items for a seller
const getAllItems = async (req, res, next) => {
    let items;
    try {
        items = await Item.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!items || items.length === 0) {
        return res.status(404).json({ message: "No items found" });
    }
    return res.status(200).json({ items });
};

// Create a new item
const addItem = async (req, res, next) => {
    try {
        const { title, description, startingBid } = req.body;
        
        // Check for required fields
        if (!title || !description || !startingBid) {
            // If there was an uploaded file but validation failed, delete it
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }
            
            return res.status(400).json({ 
                message: "Missing required fields", 
                requiredFields: {
                    title: !title ? "Title is required" : undefined,
                    image: !req.file ? "Image is required" : undefined,
                    description: !description ? "Description is required" : undefined,
                    startingBid: !startingBid ? "Starting bid is required" : undefined,
                }
            });
        }
        
        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        
        // Get image path that will be stored in the database
        const imagePath = req.file.path;
        
        // Create a new item with file path
        const newItem = new Item({
            title,
            image: imagePath, // Store the file path
            description,
            startingBid: Number(startingBid), // Convert to number if needed
        });
        
        const savedItem = await newItem.save();
        
        return res.status(201).json({ 
            message: "Item added successfully",
            item: savedItem 
        });
    } catch (err) {
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        
        console.log(err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

// Get item by ID
const getById = async (req, res, next) => {
    const itemId = req.params.id;
    let items;
    try {
        items = await Item.findById(itemId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
    if (!items) {
        return res.status(404).json({ message: "Item not available" });
    }
    return res.status(200).json({ items });
};

// Update item details
const updateItem = async (req, res, next) => {
    const id = req.params.id;
    const { title, description, startingBid } = req.body;
    
    try {
        // First, find the existing item
        const existingItem = await Item.findById(id);
        
        if (!existingItem) {
            // If item not found and file was uploaded, delete it
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Create update object with only the fields that are provided
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (startingBid) updateData.startingBid = Number(startingBid);
        
        // If a new image is uploaded, update the image path
        if (req.file) {
            // Delete old image if it exists
            if (existingItem.image) {
                fs.unlink(existingItem.image, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            updateData.image = req.file.path;
        }
        
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        return res.status(200).json({ 
            message: "Item updated successfully",
            item: updatedItem 
        });
    } catch (err) {
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        
        console.log(err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // Validate the ID
        if (!itemId || itemId === 'undefined') {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or missing item ID' 
            });
        }

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid item ID format' 
            });
        }

        // Find the item first to get the image path
        const item = await Item.findById(itemId);
        
        if (!item) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found' 
            });
        }
        
        // Delete the item from database
        const deletedItem = await Item.findByIdAndDelete(itemId);
        
        // Delete the associated image file
        if (item.image) {
            fs.unlink(item.image, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("Error deleting image:", err);
                }
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Item deleted successfully',
            data: deletedItem 
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting item',
            error: error.message 
        });
    }
};

exports.getAllItems = getAllItems;
exports.addItem = addItem;
exports.getById = getById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;