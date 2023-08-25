import taskModel from "../../../DB/model/task.model.js";
import userModel from "../../../DB/model/user.model.js";
import { asyncHandling } from "../../utils/errorHandling.js";



export const addTask=asyncHandling(async(req,res,next)=>{

    const{title,description,deadline,assignTo,status}=req.body;
    const user =await userModel.findById(req.user._id)

    const check =await userModel.findById({_id:assignTo})
    if(!check)
    {
        return res.json({ message: "This user You want to assign this task not exist 😒🤔" })


    }
    console.log("1");


    let date=new Date(deadline)
    console.log(date);

    let currentDate=new Date()
    console.log(currentDate);

    if(currentDate > date)
    {
        return res.json({message:"Enter valid date"})
    }



     let deadlinee =date

    console.log(deadline);



    const task =await taskModel.create({title,description,status,deadline:deadlinee,assignTo,userID:user._id})

    return res.json({message:"Done",task})

})



export const updateTask=asyncHandling(async(req,res,next)=>{
    const {_id}=req.params;
    // const {title,description ,assignTo}=req.body
    // const user =await userModel.findById(req.user._id)

    const task = await taskModel.findById(_id)
    if (!task) {
        return res.json({ message: "Task not found" })
    }
  
    if (task.userID.toString() != req.user._id) {
        return res.json({ message: "You are not allowed to update This task" })
    }

    const assignto = await userModel.findById(req.body.assignTo)
    if (!assignto) {
        return res.json({ message: "This user You want to assign this task not exist 😒🤔" })
    }

    let date=new Date(req.body.deadline)
    let currentDate=new Date()
    if(currentDate > date)
    {
        return res.json({message:"Enter valid date"})
    }

      req.body.deadline = date





    const update=await taskModel.updateOne({_id},req.body)
    res.json({message:"Done updatePost",update})

})



export const deleteUser=asyncHandling(async(req,res,next)=>{
    const {_id}=req.params;

    const task = await taskModel.findById(_id)
    if (!task) {
        return res.json({ message: "Task not found" })
    }

    if (task.userID.toString() != req.user._id) {
        return res.json({ message: "You are not allowed to update This task" })
    }

    const deletee=await taskModel.deleteOne({_id})
  
    res.json({message:"Done deletePost",deletee})

})


export const getAllTasks=async(req,res,next)=>{
    const tasks=await taskModel.find().populate([{
        path:"userID",
        select:'email , userName'
    },
{
    path:"assignTo",
    select:'email , userName'

}]);

    return res.json({message:"Done task",tasks})
}





export const myCreatedTasks=asyncHandling(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id)

    const allTask=await taskModel.find({userID:user._id}).populate([{
        path:"userID",
        select:'email , userName'
    },
{
    path:"assignTo",
    select:'email , userName'

}]);

    if(allTask==null)
    {
        return next(new Error("not find tasks"))

    }

    return res.json({message:"Done ",allTask})

})




export const myTasksAssignToMe=asyncHandling(async(req,res,next)=>{

    const allTask=await taskModel.find({assignTo:req.user._id}).populate([{
        path:"userID",
        select:'email , userName'
    },
{
    path:"assignTo",
    select:'email , userName'

}]);

    if(allTask==null)
    {
        return next(new Error("not find tasks"))

    }

    return res.json({message:"Done ",allTask})

})




export const lateTasks=asyncHandling(async(req,res,next)=>{

    let currentDate=new Date()
    

    const allTasks=await taskModel.find({assignTo:req.user._id ,deadline:{$lt:currentDate}}).populate([{
        path:"userID",
        select:'email , userName'
    },
{
    path:"assignTo",
    select:'email , userName'

}]);
// console.log(allTasks);
    if(!allTasks)
    {
        return next(new Error("not find tasks"))

    }
    return res.json({message:"Done ",allTasks})


})











