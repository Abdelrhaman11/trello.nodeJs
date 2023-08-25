import mongoose from "mongoose"

const connectDB=async(req,res,next)=>{
    return mongoose.connect(process.env.DB_URL).then((res)=>{
        console.log(`DB connected.........`);
    }).catch(err=>{
        console.log(`Fail to connectDB......${err}`);
    })

}

export default connectDB;