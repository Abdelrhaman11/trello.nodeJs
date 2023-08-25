import mongoose, { Schema , Types, model } from "mongoose";

const userSchema=new Schema({

 
    userName:{type:String , require:true},
    email:{type:String , require:true , unique:true , lowercase:true},
    password:{type:String , require:true},
    confirmEmail:{type:Boolean , default:false},
    gender:{type:String , default:"male" , enum:["male","female"]},
    phone:String,
    age:Number,
    tasks:[{type:mongoose.Types.ObjectId , ref:"Task"}],
    isonline:{type:Boolean , default:false },
    isDeleted:{type:Boolean , default:false },
    token:[{type:Object}]
 
},
{timestamps:true})

const userModel=model("User", userSchema);
export default userModel;

