const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
  getMe,
} = require("../Controllers/employeeControllers");
const { employeeProtect } = require("../middleware/employeeAuthMiddleware");

router.route("/").get(protect, getEmployees).post(protect, createEmployee);
router.route("/login").post(loginEmployee); // Add the login route here
router.route("/me").get(employeeProtect, getMe); // Add the getMe route here

router
  .route("/:id")
  .get(protect, getEmployee)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
