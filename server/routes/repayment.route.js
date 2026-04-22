import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import {
  getAllRepayments,
  getPendingRepayments,
  submitRepayment,
  verifyRepayment,
  getMyRepaymentHistory
} from "../conntrollers/rpayment.controller.js";

const repaymentRouter = Router();

repaymentRouter.post(
  "/submit",
  auth,
  authorizeRoles('client','agent'),
  submitRepayment
);

repaymentRouter.post(
  "/verify",
  auth,
  authorizeRoles("admin"),
  verifyRepayment
);

repaymentRouter.get(
  "/pending",
  auth,
  authorizeRoles("admin"),
  getPendingRepayments
);

repaymentRouter.get(
  "/all",
  auth,
  authorizeRoles("admin"),
  getAllRepayments
);

repaymentRouter.get(
  "/history",
  auth,
  authorizeRoles('client','agent'),
  getMyRepaymentHistory
);

export default repaymentRouter;