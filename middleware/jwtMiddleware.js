const jwt =  require('jsonwebtoken')

exports.jwtMiddleware = async (req,res,next)=>{
    console.log("inside jwt middleware");
    
    const token =  req.headers['authorization'].split(" ")[1]
   console.log(token);
   
    if(token){
        try {
       const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        req.payload = jwtResponse.email
        next()
        } catch (error) {
            res.status(500).json(error)
        }

    }else{
        res.status(401).json("invalid Token")
    }

}