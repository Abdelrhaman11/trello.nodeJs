import userModel from "../../../DB/model/user.model.js"
import bcrypt from "bcryptjs"
import { asyncHandling } from "../../utils/errorHandling.js";


export const getUser=asyncHandling(async(req,res,next)=>{
 
    const user=await userModel.findById(req.user.id);
    return res.json({message:"Done",user})
})

export const deleteUser=asyncHandling(async(req,res,next)=>{


        const userid=req.user.id

        const user=await userModel.findOneAndDelete({_id:userid})
        if(!user)
        {
            return next(new Error("In-valid  token or not login"))

        }
    
        return user?res.json({message:"Done"}):res.json({message:"NOT find"})


})


export const updateUser=asyncHandling(async(req,res,next)=>{


        const {age , phone}=req.body
        const userid=req.user.id
        const user=await userModel.findOneAndUpdate({_id:userid},
            {$set:{age,phone}})
            // console.log(user);

        if(!user)
        {
            return next(new Error("In-valid  token or not login"))

        }
        return user?res.json({message:"Done",user}):res.json({message:"NOT find"})



})

export const changePasswirdUser=asyncHandling(async(req,res,next)=>{


        const {password}=req.body
        const userid=req.user.id
        const hashPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND))

        const user=await userModel.findOneAndUpdate({_id:userid},
            {$set:{password:hashPassword}})
            // console.log(user);
        if(!user)
        {
            return next(new Error("In-valid  token or not login"))
    
        }
    
        return user?res.json({message:"Done",user}):res.json({message:"Not Find"})
        

})

export const logOut=asyncHandling(async(req,res,next)=>{

    const userid=req.user.id

    const user=await userModel.findOneAndUpdate({_id:userid},{isonline:false})
    if(!user)
    {
        return next(new Error("In-valid  token or not login"))

    }


    return res.json({message:"LogOut"})
    
})


export const softDelete=asyncHandling(async(req,res,next)=>{

        const userid=req.user.id

        const user=await userModel.findOneAndUpdate({_id:userid},{isDeleted:true , isonline:false})
     
        if(!user)
        {
            return next(new Error("In-valid  token or not login"))
    
        }
    
        return res.json({message:"Done softdelete"})

        
    })