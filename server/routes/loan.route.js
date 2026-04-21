import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { applyLoanOnline, applyLoanViaAgent,  approveProcessingFee, disburseLoan, getAllLoans, getMyLoanHistory, myLoan, rejectLoan, submitProcessingFeeManually} from "../conntrollers/loan.controller.js";

const loanRouter=Router();

loanRouter.post('/apply',auth, authorizeRoles('client','admin','agent'),applyLoanOnline)
loanRouter.post('/agent/apply',auth,authorizeRoles('agent','admin'),applyLoanViaAgent);
loanRouter.post('/submit',auth,authorizeRoles('client'),submitProcessingFeeManually);
loanRouter.post('/approve',auth,authorizeRoles('admin'),approveProcessingFee);
loanRouter.post('/reject',auth,authorizeRoles('admin'),rejectLoan);
loanRouter.post('/disburse',auth,authorizeRoles('admin'),disburseLoan);
loanRouter.get('/admin/getAllLoans',auth,authorizeRoles('admin','agent'),getAllLoans)
loanRouter.get('/activeLoan',auth,authorizeRoles('client'),myLoan)
loanRouter.get('/history',auth,authorizeRoles('client'),getMyLoanHistory)
export default loanRouter; 