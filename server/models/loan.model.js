import mongoose from "mongoose";

const loanSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    amount:{
        type:Number,
        required:true
    },
    durationWeeks:{
         type:Number,
        required:true

    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    processingFee: {
        type: Number,
        default: 200
    },

    mpesaCode: {
        type: String
    },
    feeStatus: {
        type: String,
        enum: ['pending', 'paid', 'verified', 'rejected'],
        default: 'pending'
    },

    isFeePaid: {
        type: Boolean,
        default: false
    },

    paymentVerified: {
        type: Boolean,
        default: false
    },
    agent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalRepayment: Number,
        amountPaid: {
        type: Number,
        default: 0
        },

        balance: Number,

        repaymentStatus: {
        type: String,
        enum: ["not_started", "paying", "completed", "overdue"],
        default: "not_started"
        },

        dueDate: Date

},
   
{
    timestamps:true
}
)
const LoanModel=new mongoose.model('Loan',loanSchema);
export default LoanModel;