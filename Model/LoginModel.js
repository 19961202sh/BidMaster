const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//insert details
const loginSchema = new Schema({

    username:{
        type:String,
        required:true  // validate form
    },

    password:{
         type:String,
        required:true
    }


});

module.exports = mongoose.model(
    "LoginModel",  // file name
    loginSchema   //function name
)