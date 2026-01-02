const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const aiController = require('../controller/aiController')
const { upload } = require('../middleware/multer')
const { jwtMiddleware } = require('../middleware/jwtMiddleware')
const payemnetController = require('../controller/paymentController')
//------------------- user routes ------------------

route.post('/regsiter',userController.registerController)
route.post('/login',userController.loginController)


// ai routes  

route.post('/ai/articleGenerator',jwtMiddleware,aiController.generateArticle)
route.post('/ai/blogtitlegenerator',jwtMiddleware,aiController.generateBlogTitle)

route.post('/ai/textoimage',jwtMiddleware,aiController.generateImage)
route.post('/ai/remove-background',jwtMiddleware,upload.single('image'),aiController.removeImageBackground)
route.post('/ai/remove-object',upload.single('image'),aiController.removeBackgroundObject)


route.get('/ai/text',aiController.testingAi)

// payment
route.post("/create-checkout-session",jwtMiddleware,payemnetController.createCheckoutSession);


module.exports = route



