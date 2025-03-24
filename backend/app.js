const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Route/UserRoute");
const loginRoutes = require("./Route/LoginRoute"); // Import login route

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Define routes
app.use("/users", userRoutes); // User registration routes
app.use("/auth", loginRoutes); // Login route

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin_2001:Z6sSWhMJtKgRal0o@cluster0.ceiyn.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
