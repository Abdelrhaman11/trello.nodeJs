import { Router } from "express";
import * as taskController from "./controller/task.js"
import { auth } from "../middleware/auntication.js";
const router=Router();

router.get('/',taskController.getAllTasks)
router.post('/addtask',auth,taskController.addTask)
router.put('/update/:_id',auth,taskController.updateTask)
router.delete('/delete/:_id',auth,taskController.deleteUser)
router.get('/getallcreatedtasks',auth,taskController.myCreatedTasks)
router.get('/getallcreatedtasksassigntome',auth,taskController.myTasksAssignToMe)
router.get('/latetasks',auth,taskController.lateTasks)


export default router