const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
       email:{
        type:String,
        required:true
    },
       password:{
        type:String,
        required:true
    },
       profile:{
        type:String,
        default:""
    },
    plan:{
      type:String,
      default: "trail",

    }
})

const users = mongoose.model("users",userSchema)
module.exports = users