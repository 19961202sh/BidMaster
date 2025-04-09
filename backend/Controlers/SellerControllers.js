const mongoose = require('mongoose'); // Add this line to import mongoose
const Item = require('../Model/SellerItem'); // Consistent model name

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
    const { title, description, startingBid } = req.body;
    let items;
    try {
        items = new Item({ title, description, startingBid });
        await items.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" }); // Changed 404 to 500 for server error
    }
    if (!items) {
        return res.status(404).json({ message: "Unable to add item" });
    }
    return res.status(200).json({ items });
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
    let items;
    try {
        items = await Item.findByIdAndUpdate(
            id,
            { title, description, startingBid },
            { new: true }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!items) {
        return res.status(404).json({ message: "Unable to update item details" });
    }
    return res.status(200).json({ items });
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

        const deletedItem = await Item.findOneAndDelete({ _id: itemId }); // Use Item instead of SellerItem
        
        if (!deletedItem) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found' 
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