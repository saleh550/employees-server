const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name .']
    },
    username:{
        type:String,
        required:[true,'Please add your email']

    },
    password:{
        type:String,
        required:[true,'Please add your password']

    }

})

module.exports=mongoose.model('User',userSchema)