const mongoose =  require('mongoose')

const aiSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
        prompt:{
        type:String,
        required:true
    },
    category:{
        type:String,
        
    },
   output:{
        type:String,
        required:true
      
    },
        createdAt:{
        type:Date,
       default: Date.now
    },
    ai:{
        type:String,
        required:true
    }

})

const aiDatas = mongoose.model("aiDatas",aiSchema)
module.exports  = aiDatas