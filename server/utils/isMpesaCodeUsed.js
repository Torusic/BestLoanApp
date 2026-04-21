import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";

export const isMpesaCodeUsed = async (mpesaCode) => {
  const loan = await LoanModel.findOne({ mpesaCode });
  const repayment = await RepaymentModel.findOne({ mpesaCode });

  return !!(loan || repayment);
};