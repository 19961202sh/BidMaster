const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipperSchema = new Schema({
    providerid: { type: String, required: true, unique: true },
    companyname: { type: String, required: true },
    companyemail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    companyphone: { type: String, required: true },
    companyaddress: { type: String, required: true },
    companytype: { type: String, required: true, enum: ['Local', 'International'] },
    rateperkg: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('shippers', shipperSchema);