import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { applyLoanOnline, applyLoanViaAgent, approveLoan, disburseLoan, getAllLoans, getMyLoanHistory, myLoan} from "../conntrollers/loan.controller.js";

const loanRouter=Router();

loanRouter.post('/apply',auth, authorizeRoles('client','admin','client'),applyLoanOnline)
loanRouter.post('/agent/apply',auth,authorizeRoles('agent','admin'),applyLoanViaAgent);
loanRouter.post('/approve',auth,authorizeRoles('admin'),approveLoan);
loanRouter.post('/disburse',auth,authorizeRoles('admin'),disburseLoan);
loanRouter.get('/admin/getAllLoans',auth,authorizeRoles('admin','agent'),getAllLoans)
loanRouter.get('/activeLoan',auth,authorizeRoles('client'),myLoan)
loanRouter.get('/history',auth,authorizeRoles('client'),getMyLoanHistory)
export default loanRouter; 