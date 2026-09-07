const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createWorkLog,
  getWorkLogsByMonth,
  deleteWorkLog,
  createWorkLogByEmployee,
} = require("../Controllers/worklogControllers");
const { employeeProtect } = require("../middleware/employeeAuthMiddleware");

router
  .route("/")
  // .get(protect, getWorklogs)
  .post(protect, createWorkLog);
router
  .route("/by-employee")
  .post(employeeProtect, createWorkLogByEmployee);

router
  .route("/:id")
  .get(protect, getWorkLogsByMonth)
  .delete(protect, deleteWorkLog);
router
  .route("/by-employee/:id")
  .get(employeeProtect, getWorkLogsByMonth)
  .delete(employeeProtect, deleteWorkLog);
//     .get(protect, getWorklog)
//     .put(protect, updateWorklog)

module.exports = router;
