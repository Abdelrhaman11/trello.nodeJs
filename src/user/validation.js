import joi from "joi";


export const changePassword=joi.object({

password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
cPassword:joi.string().valid(joi.ref("password")).required()

})