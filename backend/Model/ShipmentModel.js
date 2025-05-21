const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  itemid: { type: String, required: true, unique: true },
  itemname: { type: String, required: true },
  from: { type: String, required: true }, // Seller's pickup address
  collectionCenter: { type: String, required: true, default: 'Main Collection Center' }, // Fixed or configurable collection center address
  to: { type: String, required: true }, // Buyer's delivery address
  userName: { type: String, required: true }, // Seller name
  selleremail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  phone: { type: String, required: true }, // Seller phone
  buyername: { type: String, required: true },
  buyeremail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  buyerphone: { type: String, required: true },
  weight: { type: Number, required: true, min: 0 },
  shipmenttype: { type: String, required: true, enum: ['Local', 'International'] },
  cost: { type: Number, required: true, min: 0 }, // Total cost, calculated based on courier rates
  courieridToCollection: { type: String }, // Courier for seller to collection center
  courieridToBuyer: { type: String }, // Courier for collection center to buyer
  status: { 
    type: String, 
    default: 'Pending', 
    enum: [
      'Pending', 
      'Courier Assigned to Collection', 
      'Picked Up', 
      'At Collection Center', 
      'Courier Assigned to Buyer', 
      'Shipped to Buyer', 
      'Delivered', 
      'Cancelled'
    ] 
  }
}, { timestamps: true });

module.exports = mongoose.model('shipments', shipmentSchema);

/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
    itemid: { type: String, required: true, unique: true },
    itemname: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    usererName: { type: String, required: true },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String, required: true },
    //buyername: { type: String, required: true },
    //buyeremail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    //buyerphone: { type: String, required: true },
    weight: { type: Number, required: true, min: 0 },
    shipmenttype: { type: String, required: true, enum: ['Local', 'International'] },
    cost: { type: Number, required: true, min: 0 },
    courierid: { type: String }, // Assigned courier's providerid
    status: { type: String, default: 'Pending', enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('shipments', shipmentSchema);

//////////////////////////////////
worked in the mid

const shipmentSchema = new Schema({
    itemid: {
        type: String, //data type
        required: true, //validate
        unique: true //validate
    },
    itemname: {
        type: String, //data type
        required: true, //validate
    },
    from:{  
        type: String, //data type
        required: true, //validate
    },
    to:{
        type: String, //data type
        required: true, //validate
    },
    sellername: {
        type: String, //data type
        required: true, //validate
    },
    selleremail: {
        type: String, //data type
        required: true, //validate
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    sellerphone: {
        type: String, //data type
        required: true, //validate
    },
    buyername: {
        type: String, //data type
        required: true, //validate
    },      
    buyeremail: {
        type: String, //data type
        required: true, //validate
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    buyerphone: {
        type: String, //data type
        required: true, //validate
    },
    weight: {
        type: Number, //data type
        required: true, //validate
    },
    shipmenttype: {
        type: String, //data type
        required: true, //validate
        enum: ['Local', 'International']
    },
    cost: {
        type: Number, //data type
        required: true, //validate
    },
});

module.exports = mongoose.model(
    "shipments",
    shipmentSchema); //export model User with UserSchema
    */