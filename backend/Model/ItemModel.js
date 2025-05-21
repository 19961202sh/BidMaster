const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  startingPrice: {
    type: Number
  },
  image: {
    type: String,
    default: '/uploads/placeholder.png'
  },
  additionalImages: {
    type: [String],
    default: []
  },
  biddingEndTime: {
    type: Date
  },
  // Item detail fields - displayed in the view page
  condition: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Excellent'
  },
  provenance: {
    type: String
  },
  dimensions: {
    type: String
  },
  weight: {
    type: String
  },
  material: {
    type: String
  },
  maker: {
    type: String
  },
  year: {
    type: String
  },
  // Inspection related fields
  authenticity: {
    type: String,
    enum: ['Verified', 'Unverified', 'Reproduction'],
    default: 'Verified'
  },
  inspectionNotes: {
    type: String
  },
  inspectionStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before save
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Item", itemSchema);