import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    amount: {
      type: Number,
      required: true
    },

    durationWeeks: {
      type: Number,
      required: true
    },

    processingFee: {
      type: Number,
      default: 200
    },

    paybillNumber: {
      type: Number,
      default: 852648
    },

    accountNumber: {
      type: Number,
      default: 115268
    },

    feePaymentMethod: {
      type: String,
      enum: ["stk_push", "manual"],
      default: "manual"
    },

    status: {
      type: String,
      enum: [
        "awaiting_fee",
        "pending_approval",
        "approved",
        "disbursed",
        "repaid",
        "rejected"
      ],
      default: "awaiting_fee"
    },

    feeStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending"
    },

    isFeePaid: {
      type: Boolean,
      default: false
    },

    paymentVerified: {
      type: Boolean,
      default: false
    },

    stkRequestId: {
      type: String
    },

    mpesaCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    isActive: {
  type: Boolean,
  default: true,
  index: true
},

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    isDisbursed: {
      type: Boolean,
      default: false
    },

    disbursedAt: Date,

    totalRepayment: {
      type: Number,
      default: 0
    },

    amountPaid: {
      type: Number,
      default: 0
    },

    balance: {
      type: Number,
      default: 0
    },

    repaymentStatus: {
      type: String,
      enum: ["not_started", "paying", "completed", "overdue"],
      default: "not_started"
    },

    dueDate: Date
  },
  { timestamps: true }
);

// 🔒 ONE ACTIVE LOAN PER USER (REAL FIX)
loanSchema.index(
  { user: 1, isActive: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true
    }
  }
);
const LoanModel = mongoose.model("Loan", loanSchema);
export default LoanModel;