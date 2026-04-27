import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";

export const isMpesaCodeUsed = async (mpesaCode) => {
  if (!mpesaCode) return false;

  const code = mpesaCode.trim().toUpperCase();

  const [loan, repayment] = await Promise.all([
    LoanModel.findOne({ mpesaCode: code }),
    RepaymentModel.findOne({ mpesaCode: code })
  ]);

  return Boolean(loan || repayment);
};