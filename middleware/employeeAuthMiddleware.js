const jwt =require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const Employee =require('../Models/employeeModel')


const employeeProtect=asyncHandler(async(req,res,next)=>{
    let token 
    if(req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
        try {
            //get token from header
            token=req.headers.authorization.split(' ')[1]

            //Verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            //Get employee from token 
            req.employee=await Employee.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }else{
        res.status(401)
            throw new Error('Not authorized from else')
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized')
    }
})
 module.exports={employeeProtect}