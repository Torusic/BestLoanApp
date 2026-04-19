import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { getAllRepayments, getPendingRepayments, submitRepayment, verifyRepayment } from "../conntrollers/rpayment.controller.js";


const repaymentRouter = Router();

// 🔹 CLIENT submits repayment
repaymentRouter.post(
  "/submit",
  auth,
  authorizeRoles("client"),
  submitRepayment
);

// 🔹 ADMIN verifies (approve/reject)
repaymentRouter.post(
  "/verify",
  auth,
  authorizeRoles("admin"),
  verifyRepayment
);

// 🔹 ADMIN gets only pending repayments
repaymentRouter.get(
  "/pending",
  auth,
  authorizeRoles("admin"),
  getPendingRepayments
);

// 🔹 ADMIN gets all repayments (with filters)
repaymentRouter.get(
  "/all",
  auth,
  authorizeRoles("admin"),
  getAllRepayments
);

export default repaymentRouter;