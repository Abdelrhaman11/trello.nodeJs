import { Router } from "express";
import * as userController from "./controller/user.js"
import { auth } from "../middleware/auntication.js";
import { validation } from "../middleware/validation.js";
import * as validators from "./validation.js"
const router=Router();

router.get("/",auth,userController.getUser)
router.delete("/delete",auth,userController.deleteUser)
router.put("/update",auth,userController.updateUser)
router.put("/changepassword",validation(validators.changePassword),auth,userController.changePasswirdUser)
router.post("/logout",auth,userController.logOut)
router.post("/softdelete",auth,userController.softDelete)


export default router

