const asyncHandler = require('express-async-handler')
const Employee = require('../Models/employeeModel') // Assuming Employee model is in models/employeeModel.js
const WorkLog = require('../Models/worklogModel')

//@desc create new worklog
//@route POST /api/worklogs
//@access private
const createWorkLog = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { employee: employeeId, date, type, startTime, endTime, dayType, notes } = req.body

    if (!employeeId || !date || !type) {
        res.status(400)
        throw new Error('employee, date and type are required')
    }

    const employee = await Employee.findOne({ _id: employeeId, user: userId })
    if (!employee) {
        res.status(404)
        throw new Error('Employee not found')
    }

    if (type === 'day' && !dayType) {
        res.status(400)
        throw new Error('dayType is required for day work logs')
    }

    const workLog = await WorkLog.create({
        employee: employee._id,
        user: userId,
        date,
        type,
        startTime: startTime, 
        endTime: endTime, 
        dayType: type === 'day' ? dayType : undefined,
        notes,
    })

    // if (employee.payType !== type) {
    //     employee.payType = type
    //     await employee.save()
    // }

    res.status(201).json(workLog)
})
const createWorkLogByEmployee = asyncHandler(async (req, res) => {
    
    const { employee: employeeId, date, type, startTime, endTime, dayType, notes } = req.body

    if (!employeeId || !date || !type) {
        res.status(400)
        throw new Error('employee, date and type are required')
    }

    const employee = await Employee.findOne({ _id: employeeId })
    if (!employee) {
        res.status(404)
        throw new Error('Employee not found')
    }
console.log("test employee:",employee);

    if (type === 'day' && !dayType) {
        res.status(400)
        throw new Error('dayType is required for day work logs')
    }

    const workLog = await WorkLog.create({
        employee: employee._id,
        user: employee.user, // Assuming the employee has a user field
        date,
        type,
        startTime: startTime, 
        endTime: endTime, 
        dayType: type === 'day' ? dayType : undefined,
        notes,
    })

    // if (employee.payType !== type) {
    //     employee.payType = type
    //     await employee.save()
    // }

    res.status(201).json(workLog)
})
//@desc Get work logs for employee by month
//@route GET /api/worklogs/:employeeId?month=5&year=2026
//@access Private
const getWorkLogsByMonth = asyncHandler(async (req, res) => {
  const { id:employeeId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    res.status(400);
    throw new Error('Please provide month and year');
  }

  // 📅 תחילת וסוף חודש
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // 🔍 שליפת לוגים
  const logs = await WorkLog.find({
    employee: employeeId,
    // user: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  // 🧠 חישובים
  let totalHours = 0;
  let totalDays = 0;

  logs.forEach((log) => {
    if (log.type === 'hour') {
      const start = new Date(`1970-01-01T${log.startTime}`);
      const end = new Date(`1970-01-01T${log.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60);
      totalHours += hours;
    }

    if (log.type === 'day') {
      totalDays += log.dayType === 'half' ? 0.5 : 1;
    }
  });

  // 💰 להביא את העובד כדי לחשב שכר
  const employee = await Employee.findById(employeeId);
console.log(employee);
console.log(employeeId);

  let totalPay = 0;

  if (employee.payType === 'hour') {
    totalPay = totalHours * employee.rate;
  } else {
    totalPay = totalDays * employee.rate;
  }

  res.json({
    logs,
    summary: {
      totalHours,
      totalDays,
      totalPay,
    },
  });
});
//@desc Delete work log
//@route DELETE /api/worklogs/:id
//@access Private
const deleteWorkLog = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // 🔍 מציאת הלוג
  const workLog = await WorkLog.findOne({
    _id: id,
  });

  if (!workLog) {
    res.status(404);
    throw new Error("WorkLog not found");
  }

  // ❌ מחיקה
  await workLog.deleteOne();

  res.status(200).json({
    message: "WorkLog deleted successfully",
    id,
  });
});


module.exports = {
createWorkLog,
getWorkLogsByMonth,
deleteWorkLog,
createWorkLogByEmployee
}
