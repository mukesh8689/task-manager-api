const mongoose=require('mongoose');
const validator=require('validator')

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task =require('./task')


const userSchema=new mongoose.Schema({
    name:{
        type: String,
        trim:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new  Error('email is not valid');
            }
        }

    },
    password:{
        type: String,
        default:0,
        validate(value){
            if(value<0)
            {
                throw new Error('Password is not valid');
            }
        }

    },

    tokens:[{
         token:{
             type:String,
             required:true
         }

    }],

  
});


userSchema.virtual('tasks',{
    ref:'task',   /// entity name
    localField:'_id',
    foreignField:'owner'


});


userSchema.methods.generateAuthToken=async function(){

   const user=this;
   const token=jwt.sign({_id:user._id.toString()},'thisismynewcourse'); /// creatng token
   user.tokens=user.tokens.concat({ token:token})   /// adding tokens field
   await user.save();   ///saving in database
   return token;


}


userSchema.pre('save',async function(next){

const user=this;
///checking first if it has not been hashed already
if(user.isModified('password')){
    user.password=await bcrypt.hash(user.password,8); //// bcrypt takes arg as string so password type must be string
}
  
next()
})

/// middleware to delete all tasks of user when user  get deleted
userSchema.pre('remove',async function(next){

  const user=this;
  await Task.deleteMany({owner:user._id});
  next();


})
    /// taking email and password as arg 
userSchema.statics.findCredential=async (email,password)=>{

       const user=await User.findOne({email}); /// finding a user by its email
        if(!user)  /// if not found
        {
            throw new Error('unable to login');
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) //if password not match
        {
            throw new Error('unable to login');
        }
        return user; /// if matched returning that user.



}



const User=mongoose.model('User',userSchema);

module.exports=User;    