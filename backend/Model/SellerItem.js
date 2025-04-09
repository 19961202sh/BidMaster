const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const sellerItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0
  },
 
},{ timestamps: true }

);

module.exports = mongoose.model(
  "SellerItem", 
  sellerItemSchema
);