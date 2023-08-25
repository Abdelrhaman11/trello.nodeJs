import { Schema , Types, model } from "mongoose";

const taskSchema=new Schema({

 
    title:{type:String , require:true},
    description:{type:String , require:true},
    status :{type:String , default:"toDo" , enum:["toDo" , "doing" , "done"]},
    userID :{type:Schema.Types.ObjectId, ref:'User', require:true },
    assignTo :{type:Schema.Types.ObjectId, ref:'User',require:true},
    // deadline:{type:Date , require:true}
    deadline: {
        type: Date,
        require:true,
        validate: {
          validator: function (value) {
            return value > Date.now();
          },
          message: 'In valid date'
        }
      }
 

},
{timestamps:true})

const taskModel=model("Task", taskSchema);
export default taskModel;