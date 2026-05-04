const asyncHandler = require("express-async-handler");
const Employee = require("../Models/employeeModel"); // Assuming Employee model is in models/employeeModel.js
const WorkLog = require("../Models/worklogModel"); // Assuming Employee model is in models/employeeModel.js

// //@desc get employees by user
// //@route GET /api/employees
// //@access private
// const getEmployees = asyncHandler(async (req, res) => {
//     const userId = req.user._id
//     try {
//         const employees = await Employee.find({ user: userId })
//         res.status(200).json(employees)
//     } catch (error) {
//         res.status(400)
//         throw new Error(error)
//     }
// })
const getEmployees = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 📅 חודש נוכחי
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  // 👥 כל העובדים
  const employees = await Employee.find({ user: userId,status: { $ne: "deleted" } });

  const employeeIds = employees.map((e) => e._id);

  // 📊 כל הלוגים של החודש לעובדים האלה
  const logs = await WorkLog.find({
    employee: { $in: employeeIds },
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  // 🧠 חישוב workAmount לכל עובד
  const workMap = {};

  logs.forEach((log) => {
    const empId = log.employee.toString();

    if (!workMap[empId]) {
      workMap[empId] = 0;
    }

    if (log.type === "hour") {
      const start = new Date(`1970-01-01T${log.startTime}`);
      const end = new Date(`1970-01-01T${log.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60);

      workMap[empId] += hours;
    }

    if (log.type === "day") {
      workMap[empId] += log.dayType === "half" ? 0.5 : 1;
    }
  });

  // 🔥 חיבור התוצאה לעובדים
  const result = employees.map((emp) => ({
    ...emp.toObject(),
    workAmount: workMap[emp._id.toString()] || 0,
  }));

  res.status(200).json(result);
});
//@desc get single employee by id
//@route GET /api/employees/:id
//@access private
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (employee.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  res.status(200).json(employee);
});
//@desc create employee
//@route POST /api/employees
//@access private
const createEmployee = asyncHandler(async (req, res) => {
  const { name, payType, rate, hireDate, defaultStartTime, defaultEndTime } =
    req.body;

  // ✅ בדיקות
  if (!name || !rate) {
    res.status(400);
    throw new Error("Please provide required fields (name, rate)");
  }
  const ExistEmpoyyeeByName = await Employee.findOne({
    name,
    user: req.user._id,
  });
  if (ExistEmpoyyeeByName) {
    res.status(400);
    throw new Error("Employee with this name already exists");
  }
  if (!payType) {
    res.status(400);
    throw new Error("Please provide payType (hour or day)");
  }
  // אם לא נשלח payType → יהיה default = hour
  if (payType && !["hour", "day"].includes(payType)) {
    res.status(400);
    throw new Error("Invalid payType (must be hour or day)");
  }

  const employee = await Employee.create({
    name,
    payType: payType || "hour",
    rate,
    hireDate: hireDate || Date.now(),
    defaultStartTime,
    defaultEndTime,
    user: req.user._id,
  });

  res.status(201).json({ ...employee.toObject(), workAmount: 0 });
});
//@desc update employee
//@route PUT /api/employees/:id
//@access private
const updateEmployee = asyncHandler(async (req, res) => {
  const data = req.body;
  const { name, payType, rate, hireDate, status } = data;

  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (employee.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  if (!payType) {
    data.payType = employee.payType;
  } else if (!["hour", "day"].includes(payType)) {
    res.status(400);
    throw new Error("Invalid payType (must be hour or day)");
  }

  if (!status) {
    data.status = employee.status;
  } else if (!["active", "deleted"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status (must be active or deleted)");
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.status(200).json(updatedEmployee);
});
//@desc delete employee (soft delete)
//@route DELETE /api/employees/:id
//@access private
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // 🔐 בדיקת הרשאה
//   if (employee.user.toString() !== req.user._id.toString()) {
//     res.status(401);
//     throw new Error("Not authorized");
//   }

  // 🧠 Soft delete
  employee.status = "deleted";
  await employee.save();

  res.status(200).json({
    message: "Employee deleted successfully",
    id: employee._id,
  });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
