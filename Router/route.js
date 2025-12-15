const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const aiController = require('../controller/aiController')
const { upload } = require('../middleware/multer')
//------------------- user routes ------------------

route.post('/regsiter',userController.registerController)
route.post('/login',userController.loginController)


// ai routes  

route.post('/ai/articleGenerator',aiController.generateArticle)
route.post('/ai/blogtitlegenerator',aiController.generateBlogTitle)

route.post('/ai/textoimage',aiController.generateImage)
route.post('/ai/remove-background',upload.single('image'),aiController.removeImageBackground)
route.post('/ai/remove-object',upload.single('image'),aiController.removeBackgroundObject)


route.get('/ai/text',aiController.testingAi)

module.exports = route



