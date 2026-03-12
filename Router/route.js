const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const aiController = require('../controller/aiController')
const { upload } = require('../middleware/multer')
const { jwtMiddleware } = require('../middleware/jwtMiddleware')
const subscriptionController = require("../controller/subscription.controller");//------------------- user routes ------------------
const webhookController = require("../controller/webhook.controller");
route.post('/regsiter',userController.registerController)
route.post('/login',userController.loginController)


// ai routes  

route.post('/ai/articleGenerator',jwtMiddleware,aiController.generateArticle)
route.post('/ai/blogtitlegenerator',jwtMiddleware,aiController.generateBlogTitle)

route.post('/ai/textoimage',jwtMiddleware,aiController.generateImage)
route.post('/ai/remove-background',jwtMiddleware,upload.single('image'),aiController.removeImageBackground)
route.post('/ai/remove-object',upload.single('image'),aiController.removeBackgroundObject)

// get user ai datas - dashboard
route.get('/ai/get-allData',jwtMiddleware,aiController.getUserAIDataController)

route.get('/ai/text',aiController.testingAi)

// payment

route.post("/api/subscription/create", subscriptionController.createSubscription);
route.post("/api/subscription/webhook",express.raw({ type: "application/json" }),webhookController.handleWebhook
);
module.exports = route



