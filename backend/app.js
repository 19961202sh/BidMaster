const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Route/UserRoute");
const loginRoutes = require("./Route/LoginRoute"); // Import login route
const empRoutes = require("./Route/EmpRoute");
const payrollRoutes = require("./Route/PayrollRoute");
const path = require('path');


//im
const router = require("./Routes/ReportRoutes");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Define routes
app.use("/users", userRoutes); // User registration routes
app.use("/auth", loginRoutes); // Login route
app.use("/api/employees", empRoutes);
app.use("/api/payroll", payrollRoutes);


//im
app.use("/reports",router);

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin_2001:Z6sSWhMJtKgRal0o@cluster0.ceiyn.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
   app.listen(5000);
  })
  .catch((err) => console.log(err));
