const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
    itemid: {
        type: String, //data type
        required: true, //validate
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