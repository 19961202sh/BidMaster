const Payroll = require("../Model/PayrollModel");

const employee = require("../Model/EmpModel");

exports.generatePayroll = async (req, res) => {
  try {
    const employee = await employee.find({ role: { $in: ["HR", "Auctioneer", "Seller","Sales Executive"] } });

    let payrollRecords = [];
    for (let emp of employee) {
      let commission = emp.role === "Seller" ? emp.totalSales * 0.1 : 0; // 10% commission for sellers
      let totalEarnings = emp.salary + commission;
      let deductions = totalEarnings * 0.1; // Assume 10% tax deduction
      let netPay = totalEarnings - deductions;

      let payroll = new Payroll({
        employeeId: emp._id,
        role: emp.role,
        salary: emp.salary,
        commission,
        totalEarnings,
        deductions,
        netPay,
        month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
        status: "Pending",
      });

      payrollRecords.push(payroll);
      await payroll.save();
    }

    res.status(200).json({ message: "Payroll generated successfully", payrollRecords });
  } catch (error) {
    res.status(500).json({ message: "Error generating payroll", error });
  }
};

exports.getPayrollRecords = async (req, res) => {
    try {
      const payrollRecords = await Payroll.find().populate("employeeId", "name role"); // Populating employee details
  
      if (!payrollRecords || payrollRecords.length === 0) {
        return res.status(404).json({ message: "No payroll records found" });
      }
  
      res.status(200).json({ payrollRecords });
    } catch (error) {
      res.status(500).json({ message: "Error fetching payroll records", error });
    }
  };