const mongoose = require('mongoose');

const SellerItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    image: {
        type: String, // This will store the path to the uploaded image
        required: [true, 'Image is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    startingBid: {
        type: Number,
        required: [true, 'Starting bid is required'],
        min: [0, 'Starting bid cannot be negative']
    },
}, { timestamps: true });

module.exports = mongoose.model('SellerItem', SellerItemSchema);