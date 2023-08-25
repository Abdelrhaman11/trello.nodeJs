import userModel from "../../../DB/model/user.model.js";
import bcrypt from "bcryptjs"
import  JsonWebToken  from "jsonwebtoken";
import { asyncHandling } from "../../utils/errorHandling.js";
import sendEmail from "../../utils/email.js";

export const signUp=asyncHandling(async(req,res,next)=>{

    const {firstName , lastName , userName , email , password}=req.body;
    const checkUser=await userModel.findOne({email})
    if(checkUser)
    {
        return next(new Error("Email Exist"))
    }
        const hashPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND))
    const user=await userModel.create({firstName , lastName , userName , email , password: hashPassword})


    const token = JsonWebToken.sign({id:user._id , email:user.email}, process.env.EMAIL_SIGNATURE, {expiresIn:60*5})
    const newConfirmEmail = JsonWebToken.sign({id:user._id , email:user.email}, process.env.EMAIL_SIGNATURE,{expiresIn:60*60*24*30})
    const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const requestNewEmailLink=`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newConfirmEmail}`


    const html=`
    <a href="${link}">Confirm Email</a>
    <br/>
    <br/>
    <a href="${requestNewEmailLink}">Request new Confirm Email</a>
    `

    await sendEmail({to:email , subject:"Confirmation Email" , html })


    return res.status(201).json({message:"Done" , user})
 
})



export const confirmEmaill=asyncHandling(async(req,res,next)=>{

    const {token}=req.params
    // console.log({token});

    const decoded=JsonWebToken.verify(token , process.env.EMAIL_SIGNATURE)
    // console.log(decoded);
    const user=await userModel.findByIdAndUpdate(decoded.id,{confirmEmail:true})
    return user? res.json({message:"Done"}): res.json({message:"Ops looks like u don't have account yet follow me to signup now."})

})






export const newConfirmEmail=asyncHandling(async(req,res,next)=>{

    const {token}=req.params
    // console.log({token});

    const decoded=JsonWebToken.verify(token , process.env.EMAIL_SIGNATURE)
    // console.log(decoded);
    const user=await userModel.findById(decoded.id)
    if(!user)
    {
        return res.json({message:"Signup please"})
    }
    if(user.confirmEmail)
    {

        return res.json({message:"login"})

    }

    const newtoken = JsonWebToken.sign({id:user._id , email:user.email}, process.env.EMAIL_SIGNATURE, {expiresIn:60*2})
    const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`

    const html=` <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html> `

    await sendEmail({to:user.email , subject:"ConfirmEmail", html })
    return res.send(`<p>Check your inbox now</p>`)


})





export const signIn=asyncHandling(async(req,res,next)=>{
   
        const { email , password}=req.body;
        const user=await userModel.findOneAndUpdate({email},{isonline:true , isDeleted:false})
        if(!user)
        {
            return next(new Error("Email Not Exist"))
        }
        const match=bcrypt.compareSync(password , user.password)
        if(!match)
        {
            return next(new Error("In-valid login data"))

        }
        const token=JsonWebToken.sign({userName:user.userName , id:user._id },process.env.TOKEN_SIGNATURE,{expiresIn:60*60})

        return res.status(200).json({message:"Login",token})

    })



  

