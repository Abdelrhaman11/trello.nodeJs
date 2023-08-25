import { Router } from "express";
import * as authController from "./controller/auth.js"
import { validation } from "../middleware/validation.js";
import * as validators from "./validation.js"
const router=Router();

router.post("/signup",validation(validators.signup) , authController.signUp)
router.get("/confirmEmail/:token",authController.confirmEmaill)
router.get("/newConfirmEmail/:token" , authController.newConfirmEmail)
router.post("/signin",validation(validators.login) , authController.signIn)


export default router;