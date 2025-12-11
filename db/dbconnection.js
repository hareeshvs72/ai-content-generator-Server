const mongoose =  require('mongoose')
const connectionString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("databace connected success fully");
    
}).catch(err=>{
    console.log("db connection failed");
    console.log(err);
    
})