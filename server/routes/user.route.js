import { Router } from "express";
import  { adminAddAgents, adminDashboardController, getAllAgents, getAllClients, loginController, registerController } from "../conntrollers/user.controller.js";
import { auth, authorizeRoles } from "../middleware/auth.js";


const userRouter=Router()

userRouter.post('/register',registerController)
userRouter.post('/login',loginController)
userRouter.post('/admin/addAgent',auth,authorizeRoles('admin'),adminAddAgents)
userRouter.get('/admin/adminStats',auth,authorizeRoles('admin','agent'),adminDashboardController)
userRouter.get('/admin/allAgents',auth,authorizeRoles('admin'),getAllAgents)
userRouter.get('/admin/allClients',auth,authorizeRoles('admin'),getAllClients)


export default userRouter;