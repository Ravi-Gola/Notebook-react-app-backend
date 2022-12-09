var jwt = require("jsonwebtoken");

const JWT_SECRET = "raviPrajapati$$$5g";

const fetchUser= (req,res,next) =>{
   //get user from jwt token and add id to req object
   const token=req.header('auth-token');
   if(!token){
    return res.status(401).json({error:"please try with valid token"})
   }
   try {
    const data = jwt.verify(token,JWT_SECRET);
   req.user=data.user;
   next();
   } catch (error) {
      console.log(error);
      res.status(401).send({error:"some error occured"})
   }
}
module.exports=fetchUser;