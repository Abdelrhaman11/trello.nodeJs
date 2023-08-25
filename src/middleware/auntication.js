import  JsonWebToken  from "jsonwebtoken";
import { asyncHandling } from "../utils/errorHandling.js"
import userModel from "../../DB/model/user.model.js";



export const auth=asyncHandling(async(req,res, next)=>{
    const {authorization}=req.headers
    if(!authorization?.startsWith(process.env.TOKEN_BEARER))
    {
        return next(new Error("authorization is required or In_valid token"))
    }
    const token=authorization.split(process.env.TOKEN_BEARER)[1]
    if(!token)
    {
        return next(new Error(" token is required"))

    }

    const decoded=JsonWebToken.verify(token,process.env.TOKEN_SIGNATURE)
    if(!decoded?.id)
    {
        return next(new Error("In-valid token"))

    }



        const user=await userModel.findById({_id:decoded.id});
        // const user=await userModel.findById({_id:decoded.id , isonline:true , isDeleted:false});

    // console.log(user);
        if(user)
        {
            if(!user.isonline)
            {
                return next(new Error("please login first"))

            }

            if(user.isDeleted)
            {
                return next(new Error("the email is deleted please login again"))

            }

    
        }
        else
        {
            return next(new Error("Not register account"))

        }

        req.user=user
        return next()

})