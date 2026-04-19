import mongoose from "mongoose";

const repaymentSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    amount: {
      type: Number,
      required: true
    },

    mpesaCode: {
      type: String,
      required: true,
      unique: true, // prevents duplicate transactions
      index: true
    },

    paybillNumber: {
      type: Number,
      default: 852648
    },

    accountNumber: {
      type: Number,
      default: 115268
    },

    method: {
      type: String,
      enum: ["mpesa", "cash", "bank"],
      default: "mpesa"
    },

status: {
  type: String,
  enum: ["pending", "verified", "rejected"],
  default: "pending"
},

    transactionDate: {
      type: Date,
      default: Date.now
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

const RepaymentModel = mongoose.model("Repayment", repaymentSchema);

export default RepaymentModel;