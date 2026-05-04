const asyncHandler =require('express-async-handler')
const bcrypt=require('bcryptjs')
const User=require('../Models/usersModel')
const jwt =require('jsonwebtoken')


const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        		expiresIn:'30d'
 		   })
         }


//@desc register a new user
//@route POST /api/users
//@access public
const registrUser=asyncHandler( async (req,res)=>{
    
     const {username, password ,password2 ,name}=req.body

    if(password!==password2){
        res.status(500)
        throw new Error("You must to include a same passwords")
    }
    
    try {
        
        const userExist=await User.findOne({username})
        //check if the user is exists by username
        if(userExist){
            res.status(400)
            throw new Error('username already exist!')
        }
        //hash password
        const salt=await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        //Create user 
        const user=await User.create({
            name,
            username, 
            password:hashPassword
        })
        if(user){
            res.status(201)
            res.json({
                _id:user._id,
                name:user.name,
                username:user.username,
                password:user.password,
                token:generateToken(user._id)
            })
        }


    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
 }
 )
 
 //@desc login with existing user
//@route POST /api/users/login
//@access publice
const loginUser=asyncHandler( async (req,res)=>{
   const {username,password}=req.body
   
   
    try {
    const userExist = await User.findOne({  username });
    console.log(username);
    console.log(userExist);
    
    if (!userExist) {
      res.status(401);
      throw new Error("USER_IS_NOT_EXIST");
    }
    if (await bcrypt.compare(password, userExist.password)) {
      res.status(200).json({
                _id:userExist._id,
                name:userExist.name,
                username:userExist.username,
                token:generateToken(userExist._id)
      });
    } else {
      res.status(401);
      throw new Error("INVALID_PASSWORD");
    }
    } catch (error) {
        res.status(500)
        throw new Error(error)
    }
    
 
 })

 //@desc get a current user 
//@route GET /api/users/me
//@access private
const getMe=asyncHandler( async(req,res)=>{
    res.status(200).json(req.user)
})

module.exports={
    registrUser,
    loginUser,
    getMe,
}
