const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()

//------------------- user routes ------------------

route.post('/regsiter',userController.registerController)
route.post('/login',userController.loginController)

module.exports = route