import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { applyLoanOnline, applyLoanViaAgent, getAllLoans, submitProcessingFee, verifyProcessingFee } from "../conntrollers/loan.controller.js";

const loanRouter=Router();

loanRouter.post('/apply',auth, authorizeRoles('client','admin','client'),applyLoanOnline)
loanRouter.post('/agent/apply',auth,authorizeRoles('agent','admin'),applyLoanViaAgent);
loanRouter.post('/submitfee',auth,authorizeRoles('client','admin','client'),submitProcessingFee)
loanRouter.post('/verify-fee',auth,authorizeRoles('admin'),verifyProcessingFee)
loanRouter.get('/admin/getAllLoans',auth,authorizeRoles('admin','agent'),getAllLoans)

export default loanRouter; 