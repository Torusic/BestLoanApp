import mongoose from "mongoose";
import LoanModel from "../models/loan.model.js";
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URL = process.env.MONGO_URI;

async function updateLoans() {
  try {
    await mongoose.connect(MONGO_URL);

    const loans = await LoanModel.find({});

    for (const loan of loans) {

      const ratePer4Weeks = 0.05;
      const periods = loan.durationWeeks / 4;

      const interest = loan.amount * ratePer4Weeks * periods;
      const totalRepayment = loan.amount + interest;

      // update only financial fields
      loan.interestAmount = interest;
      loan.totalRepayment = totalRepayment;

      // fix balance ONLY if loan not fully repaid
      if (loan.status !== "repaid") {
        loan.balance = totalRepayment - (loan.amountPaid || 0);
      }

      await loan.save();
    }

    console.log("✅ All existing loans updated successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error updating loans:", error);
    process.exit(1);
  }
}

updateLoans();