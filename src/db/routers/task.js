const express=require('express');
const Task=require('../models/task');
const auth=require('../middleware/auth');
const router=new express.Router();


router.post('/tasks',auth,async (req,res)=>{

    ///const task=new Task(req.body);
  //  console.log(req.body.imageUri);
    //req.user.avatar=req.body.imageUri;
   // console.log(req.body.name)
    const task=new Task({
        ...req.body,name:req.body.name,avatar:req.body.imageUri,
        owner:req.user._id
    })
  try{
      await task.save();
      res.status(201).send(task);

  }catch(e){
      res.status(400).send(e);
  }

})

/// getting all images of particular type
router.post('/tasks/muk',async (req,res)=>{
  console.log(req.body.imagess)
  try{
    //  const task=await Task.find({owner:req.user._id});
    
    const task=await Task.find({name:req.body.imagess}).populate({
      path:'tasks',
          match:{
            name:req.body.imagess
          }
    }).exec();
      
       console.log(task);
      res.status(201).send(task);

  }
  catch(err){
      res.status(500).send();
  }
  

})


 // getting all images of a particular user.
router.get('/tasks/me',auth,async (req,res)=>{
 

   try{
     //  const task=await Task.find({owner:req.user._id});
        await req.user.populate('tasks').execPopulate();

      
       res.status(201).send(req.user.tasks)

   }
   catch(err){
       res.status(500).send();
   }
   

})





router.patch('/tasks/:id',auth,async (req,res)=>{

  const updates=Object.keys(req.body);
  const toUpadate=['decription','completed'];

  const isvalidupdate=updates.every((update)=>{
      return toUpadate.includes(update);
  })

  if(!isvalidupdate){
      return res.status(400).send({error:'invalid update'});
  }


  try{
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
  //  const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new :true,runValidators:true});
    if(!task)
    {
       return res.status(404).send();
    }

    updates.forEach((update)=>{
        task[update]=req.body[update]
    })

    await task.save();
    res.send(task);
}
catch(err){
    res.status(500).send(err);
  }                                                             
})

router.delete('/tasks/:id',auth,async (req,res)=>{

    try{
 // const task=await Task.findByIdAndDelete(req.params.id);
 const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});

  if(!task)
  {
     return res.status(404).send();
  }
  res.send(task);
}
catch(err){
  res.status(400).send(err);
}

}) ;






module.exports=router;