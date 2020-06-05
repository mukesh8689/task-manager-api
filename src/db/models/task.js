const mongoose=require('mongoose');
const validator=require('validator')



const Task=mongoose.model('task',{

   name:{
       type:String,
       required:true
   },

    avatar:{
        type:String
        
    },
    
    owner:{

       type: mongoose.Schema.Types.ObjectId,
       required:true,
       ref:'User'    ///relation b/w task and user

    }
})


module.exports=Task;