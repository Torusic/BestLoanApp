import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { agentApplyLoan, agentDashboardController, getClientStatus, getMyClients, registerClientByAgent } from "../conntrollers/agent.controller.js";


const agentRouter = Router();

agentRouter.get(
  "/dashboard",
  auth,
  authorizeRoles("agent"),
  agentDashboardController
);

agentRouter.post(
  "/register-client",
  auth,
  authorizeRoles("agent"),
  registerClientByAgent
);

agentRouter.post(
  "/apply-loan",
  auth,
  authorizeRoles("agent","admin"),
  agentApplyLoan
);

agentRouter.get(
  "/clients",
  auth,
  authorizeRoles("agent"),
  getMyClients
);

agentRouter.get(
  "/client-status/:nationalId",
  auth,
  authorizeRoles("agent"),
  getClientStatus
);

export default agentRouter;