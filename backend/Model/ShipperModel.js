const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipperSchema = new Schema({
    providerid: {
        type: String, //data type
        required: true, //validate
    },
    companyname: {
        type: String, //data type
        required: true, //validate
    },
    companyemail: {
        type: String, //data type
        required: true, //validate
    },  
    companyphone: {
        type: String, //data type
        required: true, //validate
    },
    companyaddress: {
        type: String, //data type
        required: true, //validate
    },companytype: {
        type: String, //data type
        required: true, //validate
        order: ['Local', 'International']
    },
    rateperkg:{
        type: Number, //data type
        required: true, //validate
    }
});

module.exports = mongoose.model(
    "shippers",
    shipperSchema); //export model User with UserSchema