const jwt=require('jsonwebtoken');
const User=require('../models/user');

const auth=async (req,res,next)=>{
 try{
    const token=req.header('Authorization').replace('Bearer ',''); /// getting token sent from client(postman)
     const decoded=jwt.verify(token,'thisismynewcourse'); /// vrifying token

     const user=await User.findOne({_id: decoded._id,'tokens.token':token}) /// getting that one user using data in token
     if(!user){
         throw new Error();
     }
     req.token=token; /// to get one particular token 
      req.user=user;  /// storing user in req
      next()
    
 }
catch(err){
    res.status(401).send({error:'please authenticate'});
}

}



module.exports=auth;