
//Z6sSWhMJtKgRal0o

const express = require("express");
const mongoose = require("mongoose");


const router = require("./Route/LoginRoute");

const app = express();

//connect middleware
app.use(express.json());
app.use("/users",router);


mongoose.connect("mongodb+srv://admin_2001:Z6sSWhMJtKgRal0o@cluster0.ceiyn.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));