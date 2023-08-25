

export const asyncHandling=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(error=>{
            return next(new Error(error))
        })
    }

}

export const globalErrorHandling=(error,req,res,next)=>{
    return res.json({message:"Error",msgError:error.message})
}
