import dotenv from "dotenv"
dotenv.config()
import bootstrap from "./src/index.router.js";
import express from "express";
import sendEmail from "./src/utils/email.js";

const app=express();
const port =5001;



// sendEmail({to:"abdokhaledhamed38@gmail.com" , subject:"aaaa" , html:"<p>hellllow bodaaaa</p>"})

bootstrap(app,express);


app.listen(port,(req,res,next)=>{
    console.log(`Example app listening on port ${port}!`);
})