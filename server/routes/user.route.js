import { Router } from "express";
import  { adminAddAgents, adminDashboardController, changePasswordController, getAllAgents, getAllClients, getUserSettingsController, loginController, logoutController, registerController, toggleNotificationController, updateProfileController } from "../conntrollers/user.controller.js";
import { auth, authorizeRoles } from "../middleware/auth.js";


const userRouter=Router()

userRouter.post('/register',registerController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.post('/admin/addAgent',auth,authorizeRoles('admin'),adminAddAgents)
userRouter.get('/admin/adminStats',auth,authorizeRoles('admin'),adminDashboardController)
userRouter.get('/admin/allAgents',auth,authorizeRoles('admin'),getAllAgents)
userRouter.get('/admin/allClients',auth,authorizeRoles('admin'),getAllClients)
userRouter.put("/user/update-profile", auth,authorizeRoles('admin','client','agent'), updateProfileController);
userRouter.put("/user/change-password", auth, authorizeRoles('admin','client','agent'),changePasswordController);
userRouter.put("/user/toggle-notifications", auth,authorizeRoles('admin','client','agent'), toggleNotificationController);
userRouter.get("/user/settings", auth,authorizeRoles('admin','client','agent'), getUserSettingsController);


export default userRouter;