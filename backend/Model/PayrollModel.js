const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "EmpModel", required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  totalEarnings: { type: Number, required: true },
  deductions: { type: Number, required: true },
  netPay: { type: Number, required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
});

module.exports = mongoose.model("PayrollModel", PayrollSchema);
