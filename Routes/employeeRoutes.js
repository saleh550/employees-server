const express=require('express')
const router=express.Router()
const {protect}=require("../middleware/authMiddleware")
const { getEmployees, getEmployee, createEmployee, updateEmployee } = require('../Controllers/employeeControllers')

router.route('/')
    .get(protect, getEmployees)
    .post(protect, createEmployee)

router.route('/:id')
    .get(protect, getEmployee)
    .put(protect, updateEmployee)

module.exports=router
