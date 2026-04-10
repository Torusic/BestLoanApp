import { request } from "express";
import LoanModel from "../models/loan.model.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import mongoose from "mongoose";

//Apply loan
export async function applyLoanOnline(req, res) {
    try {
        const clientId = req.userId;
        const { amount, durationWeeks } = req.body;

        if (amount < 5000 || amount > 95000) {
            return res.status(400).json({
                message: 'Invalid amount',
                error: true,
                success: false
            });
        }

        if (durationWeeks < 4 || durationWeeks > 24) {
            return res.status(400).json({
                message: 'Invalid duration',
                error: true,
                success: false
            });
        }

        // Check for any active loan or loan with balance > 0
        const loanActive = await LoanModel.findOne({
            user: clientId,
            $or: [
                { status: { $in: ["pending", "approved", "disbursed"] } },
                { balance: { $gt: 0 } }
            ]
        });

        if (loanActive) {
            return res.status(400).json({
                message: "You have an active or unpaid loan. Please clear it before applying for a new loan.",
                error: true,
                success: false
            });
        }

        const createLoan = await LoanModel.create({
            user: clientId,
            amount,
            durationWeeks,
        });

        await createLoan.save();

        return res.status(200).json({
            message: "Loan request submitted",
            error: false,
            success: true,
            data: createLoan
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
//apply loan via agent
export async function applyLoanViaAgent(req, res) {
    try {
        const agentId = req.userId;
        const { name, email, phone, nationalId, amount, durationWeeks, mpesaCode } = req.body;

        // Check if user exists
        let client = await UserModel.findOne({ nationalId });

        if (!client) {
            const hashedPassword = await bcryptjs.hash("1234", 10);
            client = await UserModel.create({
                name,
                email,
                phone,
                nationalId,
                password: hashedPassword,
                role: 'client'
            });
        }

        if (amount < 5000 || amount > 95000) {
            return res.status(400).json({
                message: "Invalid amount",
                error: true,
                success: false
            });
        }

        if (durationWeeks < 4 || durationWeeks > 24) {
            return res.status(400).json({
                message: "Invalid duration",
                error: true,
                success: false
            });
        }

        // Check for any active loan or unpaid loan
        const loanActive = await LoanModel.findOne({
            user: client._id,
            $or: [
                { status: { $in: ["pending", "approved", "disbursed"] } },
                { balance: { $gt: 0 } }
            ]
        });

        if (loanActive) {
            return res.status(400).json({
                message: "Client has an active or unpaid loan. Cannot apply for a new one.",
                error: true,
                success: false
            });
        }

        if (!mpesaCode) {
            return res.status(400).json({
                message: "Enter a valid MPESA code!",
                error: true,
                success: false
            });
        }

        const existingMpesacode = await LoanModel.findOne({ mpesaCode });
        if (existingMpesacode) {
            return res.status(400).json({
                message: "MPESA code already used!",
                error: true,
                success: false
            });
        }

        const loan = await LoanModel.create({
            user: client._id,
            agent: agentId,
            amount,
            durationWeeks,
            mpesaCode
        });

        return res.status(200).json({
            message: "Loan via agent submitted successfully",
            error: false,
            success: true,
            data: loan
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function approveLoan(req, res) {
  try {
    const { loanId } = req.body
    const adminId = req.userId

    const loan = await LoanModel.findById(loanId).populate('user') // ✅ populate

    if (!loan) {
      return res.status(404).json({ message: "Loan not found", success: false })
    }

    if (loan.status === "approved") {
      return res.status(400).json({ message: "Loan already approved" })
    }

    loan.status = "approved"
    loan.approvedBy = adminId

    await loan.save()

    return res.status(200).json({
      message: "Loan approved successfully",
      success: true,
      data: loan
    })

  } catch (error) {
    return res.status(500).json({ message: error.message || error })
  }
}


export async function disburseLoan(req, res) {
  try {
    const { loanId } = req.body

    const loan = await LoanModel.findById(loanId)

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found"
      })
    }

    if (loan.status !== "approved") {
      return res.status(400).json({
        message: "Loan must be approved first"
      })
    }

    if (loan.isDisbursed) {
      return res.status(400).json({
        message: "Already disbursed"
      })
    }

    loan.isDisbursed = true
    loan.disbursedAt = new Date()
    loan.status="disbursed"

    loan.totalRepayment = loan.amount
    loan.amountPaid = 0
    loan.balance = loan.totalRepayment

    loan.repaymentStatus = "paying"

    loan.dueDate = new Date(
      Date.now() + loan.durationWeeks * 7 * 24 * 60 * 60 * 1000
    )

    await loan.save()

    return res.status(200).json({
      message: "Loan disbursed successfully",
      success: true,
      data: loan
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error
    })
  }
}

export async function getMyLoanHistory(req, res) {
  try {
    const userId = req.userId;

    const loans = await LoanModel.find({ user: userId })
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    if (!loans.length) {
      return res.status(404).json({
        message: "No loan history found",
        success: false
      });
    }

    const now = new Date();

    const formatted = loans.map((loan) => {
      let loanType = "pending";

      //  Fully repaid (MOST IMPORTANT)
      if (loan.balance === 0 && loan.isDisbursed) {
        loanType = "fully_repaid";
      }

      //  Overdue loan
      else if (
        loan.dueDate &&
        loan.balance > 0 &&
        loan.dueDate < now
      ) {
        loanType = "overdue";
      }

      //  Active repayment
      else if (loan.isDisbursed && loan.balance > 0) {
        loanType = "active";
      }

      //  Not yet disbursed
      else if (loan.status === "pending" || loan.status === "approved") {
        loanType = "processing";
      }

      return {
        ...loan.toObject(),
        loanType
      };
    });

    return res.status(200).json({
      message: "Loan history fetched successfully",
      success: true,
      data: formatted
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false
    });
  }
}
// getAllLoans
export async function getAllLoans(req,res){
    try {
        const loans = await LoanModel.find()
            .populate('agent', 'name email status nationalId')
            .populate('user', 'name email phone nationalId') // ✅ populate user info
            .sort({ createdAt: -1 })

        if (!loans || loans.length === 0) {
            return res.status(400).json({
                message:"No loans available",
                error:true,
                success:false
            })
        }

        return res.status(200).json({
            message:"All loans fetched successfully",
            error:false,
            success:true,
            data:loans
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}
export async function myLoan(req, res) {
    try {
        const userId = req.userId;

        const loan = await LoanModel.findOne({
            user: userId,
            status: { $in: ["pending", "approved","disbursed"] }
        }).sort({ createdAt: -1 });

        if (!loan) {
            return res.status(404).json({
                message: "No active loan found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Active loan fetched successfully",
            error: false,
            success: true,
            data: loan
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}