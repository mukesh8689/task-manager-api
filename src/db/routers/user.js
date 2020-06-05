
const User=require('../models/user');  ///import model
const express=require('express'); ///setting router
const router=new express.Router(); ///setting router
const auth=require('../middleware/auth');

router.post('/signup',async (req,res)=>{
    /// creating new user
     const user=new User(req.body);/// here req.body is json info sent through postman body
 
     try{
       await user.save();
       const token=await user.generateAuthToken();
       res.status(201).send({user,token});
     }
    catch(e){
 
       res.status(400).send(e);
    }
 })

 
 router.post('/signin',async(req,res)=>{

   try{

    const user=await User.findCredential(req.body.email,req.body.password); /// own method
    const token=await user.generateAuthToken();
    res.send({user,token});

   }  catch(e){
       res.status(400).send();

   }


 })

  router.post('/signout',auth,async(req,res)=>{

     try{
       req.user.tokens=req.user.tokens.filter((token)=>{

            return token.token!==req.token;


       })

       await req.user.save();
          res.send();

     }
     catch(err){
        res.status(500).send();

     }
  

})

 
 router.get('/users/me',auth,async (req,res)=>{
     res.send(req.user); /// getting only its info
 
 })
 
 
 
 router.patch('/users/me',auth,async (req,res)=>{
     const updates=Object.keys(req.body);
    const allowedUpdates=['name','password','age','email'];
 
    const isvalidupdate=updates.every((update)=>{
       return allowedUpdates.includes(update);
    })
 
    if(!isvalidupdate)
    {
        return res.status(400).send({error:'invalid update'});
    }
 
 
 
     try{
     ///const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    /// making dynamic
    /// const user=await User.findByIdAndUpdate(req.params.id);
       updates.forEach((update)=>{
           req.user[update]=req.body[update];
       })

       await req.user.save();


      /*if(!user)
     {
        return res.status(404).send();
     } */
     res.send(req.user);
 }
 catch(err){
     res.status(401).send(err);
 }
 
 })
 
 router.delete('/users/me',auth,async (req,res)=>{
 
     try{

      await req.user.remove();
      res.send(req.user); /// change
 
     }
     catch(err)
     {
         res.status(401).send(err);
     }
 })


 router.post('/users/me/avatar',auth,async (req,res)=>{

     /// file->what we appended
       // console.log(req.body);
   req.user.avatar=req.body.imageUri;
   await req.user.save();

      res.send();
 },
 (error,req,res,next) =>{
     res.status(400).send({error:error.message});
 }
 );



router.delete('/users/me/avatar',auth,async (req,res)=>{

    req.user.avatar=undefined
    await req.user.save();
    res.send();

})

router.get('/users/:id/avatar',async (req,res)=>{
   try{
    const user=await User.findById(req.params.id);
    if(!user||!user.avatar)
    {
        throw new Error()
    }
   res.set('Content-Type','image/jpg')
   res.send(user.avatar);


   }
   catch(err)
   {
       res.status(404).send();
   }


});

router.get('/users'),async (req,res)=>{
   try{
       const user=await  User.find({});
       if(!user)
       {
           res.status(404).send();
       }

    res.send(user);

   }
   catch(err)
   {
       res.status(500).send(err);
   }

}

 
 
module.exports=router;