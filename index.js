const express = require('express')
const cors = require('cors')
const route = require('./Router/route')
require('dotenv').config()
require('./db/dbconnection')
const server  = express()
server.use(cors())
// IMPORTANT: webhook must use raw body before JSON parser
server.use("/api/subscription/webhook", express.raw({ type: "application/json" })); 
server.use(express.json())
server.use(route)


const PORT =  5000

server.listen(PORT,()=>{
    console.log(' sevrer is run on 3000 port');
    
})


server.get('/',(req,res)=>{
    res.status(200).send("<h1>server is running</h1>")
})