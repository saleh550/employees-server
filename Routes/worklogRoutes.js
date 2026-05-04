const express=require('express')
const router=express.Router()
const {protect}=require("../middleware/authMiddleware")
const { createWorkLog,getWorkLogsByMonth,deleteWorkLog } = require('../Controllers/worklogControllers')

router.route('/')
    // .get(protect, getWorklogs)
    .post(protect, createWorkLog)

router.route('/:id').get(protect, getWorkLogsByMonth).delete(protect, deleteWorkLog)
//     .get(protect, getWorklog)
//     .put(protect, updateWorklog)

module.exports=router
