import LoanModel from "../models/loan.model.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { isMpesaCodeUsed } from "../utils/isMpesaCodeUsed.js";
import { formatPhone } from "../utils/formatPhone.js";

export async function applyLoanOnline(req, res) {
    try {
        const clientId = req.userId;
        const { amount, durationWeeks } = req.body;

        if (amount < 5000 || amount > 95000) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (durationWeeks < 4 || durationWeeks > 24) {
            return res.status(400).json({ message: "Invalid duration" });
        }

       const loanActive = await LoanModel.findOne({
    user: clientId,
    status: { 
        $in: ["awaiting_fee", "pending_approval", "approved","disbursed"] 
    }
});

        if (loanActive) {
            return res.status(400).json({ message: "Active loan exists" });
        }

        const loan = await LoanModel.create({
            user: clientId,
            amount,
            durationWeeks,
            status: "awaiting_fee",
            feeStatus: "pending",
            isFeePaid: false,
            paymentVerified: false,
            totalRepayment:0,
            balance: 0,
            amountPaid: 0
        });

        return res.status(200).json({ success: true, data: loan });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function applyLoanViaAgent(req, res) {
  try {
    const agentId = req.userId;

    const {
      name,
      email,
      nationalId,
      amount,
      durationWeeks,
      mpesaCode
    } = req.body;

    // ================= PHONE VALIDATION =================
    const phone = formatPhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    // ================= FIND OR CREATE CLIENT =================
    let client = await UserModel.findOne({ nationalId });

    if (!client) {
      const hashedPassword = await bcryptjs.hash("1234", 10);

      client = await UserModel.create({
        name,
        email,
        phone, // ✅ normalized phone
        nationalId,
        password: hashedPassword,
        role: "client",
        createdBy: agentId // 🔥 important for ownership tracking
      });
    } else {
      // Optional safety: keep phone updated if wrong format was stored before
      if (client.phone !== phone) {
        client.phone = phone;
        await client.save();
      }
    }

    // ================= CHECK ACTIVE LOAN =================
    const loanActive = await LoanModel.findOne({
      user: client._id,
      status: {
        $in: ["awaiting_fee", "pending_approval", "approved", "disbursed"]
      }
    });

    if (loanActive) {
      return res.status(400).json({
        success: false,
        message: "Active loan exists"
      });
    }

    // ================= MPESA CHECK =================
    if (mpesaCode && await isMpesaCodeUsed(mpesaCode)) {
      return res.status(400).json({
        success: false,
        message: "MPESA code already used"
      });
    }

    // ================= CREATE LOAN =================
    const loan = await LoanModel.create({
      user: client._id,
      agent: agentId,
      amount,
      durationWeeks,
      mpesaCode,
      status: "pending_approval",
      feeStatus: "verified",
      isFeePaid: true,
      paymentVerified: true,
      totalRepayment: amount,
      balance: 0,
      amountPaid: 0
    });

    return res.status(200).json({
      success: true,
      data: loan
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function submitProcessingFeeManually(req, res) {
    try {
        const userId = req.userId;
        const { mpesaCode, amount } = req.body;

        const loan = await LoanModel.findOne({
            user: userId,
            status: "awaiting_fee"
        });

        if (!loan) {
            return res.status(400).json({ message: "No loan awaiting fee" });
        } if (await isMpesaCodeUsed(mpesaCode)) {
      return res.status(400).json({
        message: "MPESA code already used"
      });
    }

        const existing = await LoanModel.findOne({ mpesaCode });

        if (existing) {
            return res.status(400).json({ message: "MPESA code used" });
        }

        if (Number(amount) !== Number(loan.processingFee || 0)) {
            return res.status(400).json({ message: "Invalid fee amount" });
        }

        loan.mpesaCode = mpesaCode;
        loan.feeStatus = "submitted";
        loan.isFeePaid = true;
        loan.status = "pending_approval";

        await loan.save();

        return res.status(200).json({ success: true, data: loan });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function approveProcessingFee(req, res) {
    try {
        const { loanId } = req.body;

        const loan = await LoanModel.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        loan.feeStatus = "verified";
        loan.isFeePaid = true;
        loan.paymentVerified = true;
        loan.status = "approved";
        loan.approvedBy = req.userId;

        await loan.save();

        return res.status(200).json({ success: true, data: loan });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function rejectLoan(req, res) {
  try {
    const { loanId } = req.body;

    if (!loanId) {
      return res.status(400).json({
        success: false,
        message: "Loan ID is required"
      });
    }

    const loan = await LoanModel.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }

    // Prevent rejecting already processed loans
    if (loan.status === "disbursed" || loan.status === "repaid") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject a processed loan"
      });
    }

    loan.status = "rejected";
    loan.feeStatus = "rejected";
    loan.isFeePaid = false;
    loan.paymentVerified = false;

    await loan.save();

    return res.status(200).json({
      success: true,
      message: "Loan rejected successfully",
      data: loan
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function approveLoan(req, res) {
    try {
        const { loanId } = req.body;

        const loan = await LoanModel.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (loan.status !== "pending_approval") {
            return res.status(409).json({ message: "Not ready" });
        }

        loan.status = "approved";
        loan.approvedBy = req.userId;

        await loan.save();

        return res.status(200).json({ success: true, data: loan });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function disburseLoan(req, res) {
    try {
        const { loanId } = req.body;

        const loan = await LoanModel.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (loan.status !== "approved") {
            return res.status(409).json({ message: "Must be approved first" });
        }

        loan.status = "disbursed";
        loan.isDisbursed = true;
        loan.disbursedAt = new Date();
        loan.totalRepayment = loan.amount;
        loan.balance = loan.amount;
        loan.amountPaid = 0;
        loan.repaymentStatus = "not_started";

        loan.dueDate = new Date(
            Date.now() + loan.durationWeeks * 7 * 24 * 60 * 60 * 1000
        );

        await loan.save();

        return res.status(200).json({ success: true, data: loan });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function myLoan(req, res) {
    try {
        const loan = await LoanModel.findOne({
            user: req.userId,
            status: { $in: ["awaiting_fee", "pending_approval", "approved", "disbursed"] }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: loan || null,
            message: loan ? "Active loan found" : "No active loan"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getMyLoanHistory(req, res) {
    try {
        const loans = await LoanModel.find({ user: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: loans });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getAllLoans(req, res) {
    try {
        const loans = await LoanModel.find()
            .populate("user agent")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: loans });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}