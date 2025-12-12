const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const aiController = require('../controller/aiController')
//------------------- user routes ------------------

route.post('/regsiter',userController.registerController)
route.post('/login',userController.loginController)


// ai routes  

route.post('/ai/articleGenerator',aiController.generateArticle)

module.exports = route