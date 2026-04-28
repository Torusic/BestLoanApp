import mongoose from "mongoose";
import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URI;

// 🔧 normalize function
const normalizeMpesaCode = (code) => {
  if (!code) return null;
  return code.trim().toUpperCase();
};

async function updateMpesaCodes() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("🔄 Connected to DB");

    // =========================
    // 1. UPDATE LOANS
    // =========================
    const loans = await LoanModel.find({ mpesaCode: { $exists: true, $ne: null } });

    let loanCount = 0;

    for (const loan of loans) {
      const normalized = normalizeMpesaCode(loan.mpesaCode);

      // skip if already clean
      if (loan.mpesaCode === normalized) continue;

      loan.mpesaCode = normalized;
      await loan.save();
      loanCount++;
    }

    console.log(`✅ Loans updated: ${loanCount}`);

    // =========================
    // 2. UPDATE REPAYMENTS
    // =========================
    const repayments = await RepaymentModel.find({
      mpesaCode: { $exists: true, $ne: null }
    });

    let repaymentCount = 0;

    for (const rep of repayments) {
      const normalized = normalizeMpesaCode(rep.mpesaCode);

      // skip if already clean
      if (rep.mpesaCode === normalized) continue;

      rep.mpesaCode = normalized;
      await rep.save();
      repaymentCount++;
    }

    console.log(`✅ Repayments updated: ${repaymentCount}`);

    await mongoose.disconnect();
    console.log("🚀 Migration complete");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

updateMpesaCodes();