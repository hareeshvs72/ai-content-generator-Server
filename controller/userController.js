const users = require("../Model/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.registerController = async (req, res) => {
    console.log("inside register Controller");

    const { username, email, password } = req.body
    console.log(username, email, password);

    try {
        const bycryptPassword = await bcrypt.hash(password, 10)
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(409).json("User Already Exist")
        }
        else {
            const newUser = new users({
                username, email, password: bycryptPassword
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
}

exports.loginController = async (req, res) => {
    console.log("inside login controller");
    const { email, password } = req.body

    try {
        const existingUser = await users.findOne({ email })
 console.log(existingUser);
 
        if (existingUser) {
            const decodePassword = await bcrypt.compare(password, existingUser.password)
            console.log(decodePassword);

            if(!decodePassword){
                res.status(401).json("Invalid PAssword")
            }
            else{
                const token =   jwt.sign({email:existingUser.email},process.env.JWTSECRET) 
                res.status(200).json({user:existingUser,token})
            }
          
        }
        else {
            res.status(404).json("Invali Email Please Reigter To access our app")
        }


    } catch (error) {
        res.status(500).json(error)
    }


}
