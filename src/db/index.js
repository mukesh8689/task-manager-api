const express=require('express');
const app=express();
require('../db/mongoose');  /// so that mongoose connect to database
 /// importing model required for fields
const userRouter=require('./routers/user'); ///userrouter import
const taskRouter=require('./routers/task'); ///taskrouter  import

const port=process.env.PORT;


app.use(express.json());
app.use(userRouter);  ////user
app.use(taskRouter); ///task

app.listen(port,()=>{
    console.log('server is up on port :' +port);
})


//const Task=require('./models/task');
//const User=require('./models/user');

//const main=async ()=>{
   // const task=await Task.findById('5eca3b6de8a4e1162c86fa9e');  
   //  await task.populate('owner').execPopulate(); /// rather than getting only id, we will get whole profile of owner.
   // console.log(task.owner);

   //const user=await User.findById('5eca3a49a2a9051124ef3469');
   //await user.populate('tasks').execPopulate();
   //console.log(user.tasks);
  //}

//main();