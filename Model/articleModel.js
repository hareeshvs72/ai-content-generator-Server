const mongoose =  require('mongoose')

const ArticleSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
        prompt:{
        type:String,
        required:true
    },
   output:{
        type:String,
      
    },
        createdAt:{
        type:Date,
       default: Date.now
    }
})

const articles = mongoose.model("articles",ArticleSchema)
module.exports  = articles