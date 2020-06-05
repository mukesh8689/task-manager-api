const mongoose=require('mongoose');


const connectionURL=MONGODB_URL;
//mongodb://127.0.0.1:27017/task-manager-api
mongoose.connect(connectionURL,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false})






/*const Task=mongoose.model('task',{
    description:{
        type:  String

    },
    completed:{
        type:Boolean
    }
})

const db=new Task({
    description: 'study',
    completed:false
})
 
db.save().then(()=>{
    console.log(db);
}).catch((error)=>{
    console.log('Error',error);
})
*/
