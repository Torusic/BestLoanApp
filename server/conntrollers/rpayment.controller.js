import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";
import { isMpesaCodeUsed } from "../utils/isMpesaCodeUsed.js";

export async function submitRepayment(req, res) {
  try {
    const userId = req.userId;
    const { loanId, amount, mpesaCode } = req.body;

    if (!loanId || !amount || !mpesaCode) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }
     if (await isMpesaCodeUsed(mpesaCode)) {
      return res.status(400).json({
        success: false,
        message: "MPESA code already used"
      });
    }

    const loan = await LoanModel.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }

    if (String(loan.user) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const existing = await RepaymentModel.findOne({ mpesaCode });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Duplicate M-Pesa code"
      });
    }

    const repayment = await RepaymentModel.create({
      loan: loan._id,
      user: userId,
      amount: Number(amount),
      mpesaCode,
      paybillNumber: loan.paybillNumber,
      accountNumber: loan.accountNumber,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Payment submitted. Awaiting admin verification",
      data: repayment
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function verifyRepayment(req, res) {
  try {
    const adminId = req.userId;
    const { repaymentId, action } = req.body;

    if (!repaymentId || !action) {
      return res.status(400).json({
        success: false,
        message: "repaymentId and action required"
      });
    }

    const repayment = await RepaymentModel.findById(repaymentId);

    if (!repayment) {
      return res.status(404).json({
        success: false,
        message: "Repayment not found"
      });
    }

    if (repayment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already processed"
      });
    }

    const loan = await LoanModel.findById(repayment.loan);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }

    // ❌ REJECT
    if (action === "reject") {
      repayment.status = "rejected";
      await repayment.save();

      return res.status(200).json({
        success: true,
        message: "Repayment rejected"
      });
    }

    // ✅ APPROVE
    if (action === "approve") {
      repayment.status = "verified";
      repayment.verifiedBy = adminId;
      repayment.verifiedAt = new Date();

      // 💰 Update loan
    // 💰 Update loan
loan.amountPaid += repayment.amount;
loan.balance -= repayment.amount;

// ✅ LOAN STATUS LOGIC (PUT IT HERE)
if (loan.balance <= 0) {
  loan.balance = 0;
  loan.status = "repaid";
  loan.repaymentStatus = "completed";
} else {
  loan.repaymentStatus = "paying";
}
      

      await repayment.save();
      await loan.save();

      return res.status(200).json({
        success: true,
        message: "Repayment verified successfully"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function getPendingRepayments(req, res) {
  try {
    const repayments = await RepaymentModel.find({
      status: "pending"
    })
      .populate("user", "name phone")
      .populate("loan", "amount balance");

    return res.status(200).json({
      success: true,
      data: repayments
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function getAllRepayments(req, res) {
  try {
    const { status, search } = req.query;

    let query = {};

    // 🔍 Filter by status (pending, verified, rejected)
    if (status) {
      query.status = status;
    }

    // 🔎 Search by mpesaCode or nationalId
    if (search) {
      query.$or = [
        { mpesaCode: { $regex: search, $options: "i" } }
      ];
    }

    const repayments = await RepaymentModel.find(query)
      .populate("user", "name phone nationalId")
      .populate("loan", "amount balance status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: repayments.length,
      data: repayments
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function getMyRepaymentHistory(req, res) {
  try {
    const userId = req.userId;

    const repayments = await RepaymentModel.find({
      user: userId,
    })
      .populate("loan", "amount balance status repaymentStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Repayment history fetched successfully",
      count: repayments.length,
      data: repayments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}