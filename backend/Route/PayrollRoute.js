const express = require("express");
const router = express.Router();
const PayrollControl = require("../Controlers/PayrollControl");

router.post("/generate", PayrollControl.generatePayroll); // Generate payroll for all employees
router.get("/", PayrollControl.getPayrollRecords); // Get all payroll records

module.exports = router;
