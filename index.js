const express = require('express')
const cors = require('cors')
const route = require('./Router/route')
require('dotenv').config()
require('./db/dbconnection')
const server  = express()
server.use(cors())
server.use(express.json())
server.use(route)


const PORT =  3000

server.listen(PORT,()=>{
    console.log(' sevrer is run on 3000 port');
    
})


server.get('/',(req,res)=>{
    res.status(200).send("<h1>server is running</h1>")
})