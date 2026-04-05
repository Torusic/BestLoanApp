import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    amount: {
      type: Number,
      required: true
    },

    durationWeeks: {
      type: Number,
      required: true
    },

  
    status: {
      type: String,
      enum: ["pending", "awaiting_fee", "awaiting_approval", "approved", "rejected"],
      default: "pending"
    },

    processingFee: {
      type: Number,
      default: 200
    },


  stkRequestId: { 
    type: String 
  },
  mpesaCode: { 
    type: String, 
    unique: true, 
    sparse: true },

    feeStatus: {
      type: String,
      enum: ["pending", "paid", "verified", "rejected"],
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

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

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
    isDisbursed: {
      type: Boolean,
      default: false
    },
    disbursedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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

const LoanModel = mongoose.model("Loan", loanSchema);
export default LoanModel;