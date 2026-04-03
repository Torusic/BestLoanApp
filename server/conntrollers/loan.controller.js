import { request } from "express";
import LoanModel from "../models/loan.model.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs"

//Apply loan
export async function applyLoanOnline(req,res){
    try {
        const clientId=req.userId;
        const{amount,durationWeeks}=req.body;

        if(amount<5000 || amount>95000){
            return res.status(400).json({
                message:'Inavalid amount',
                error:true,
                success:false
            })
        }
        if(durationWeeks<4 || durationWeeks>24){
            return res.status(400).json({
                message:'Inavalid duration',
                error:true,
                success:false
            })

        }
        //prevent multiple loans
        const loanActive=await LoanModel.findOne({user:clientId,status:{ $in: ["pending", "approved"] }})

        if(loanActive){
            return res.status(400).json({
                message:"Loan Is Active...Wait as we process after 24 hours",
                error:true,
                success:false
        })

        }
        const createLoan=await LoanModel.create({
            user:clientId,
            amount,
            durationWeeks,
            
        })
        await createLoan.save()

        return res.status(200).json({
            message:"Loan request Submitted",
            error:false,
            success:true,
            data:createLoan
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
//apply loan via agent
export async function applyLoanViaAgent(req,res) {
    try {
        const agentId=req.userId;
        const{name,email,phone,nationalId, amount, durationWeeks,mpesaCode}=req.body

        //check if user exists
        let client=await UserModel.findOne({nationalId});

       if(!client){
         const hashedPassword = await  bcryptjs.hash("1234", 10);

         client = await UserModel.create({
            name,
            email,
            phone,
            nationalId,
            password:hashedPassword,
            role:'client'
            
        })


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

        //prevent multiple loans
        const loanActive=await LoanModel.findOne({user:client._id,status:{ $in: ["pending", "approved"] }})

        if(loanActive){
            return res.status(400).json({
                message:"Loan Is Active...Wait as we process after 24 hours",
                error:true,
                success:false
        })

        }
        if(!mpesaCode){
            return res.status(400).json({
                message:"Enter a valid code !!!",
                error:true,
                success:false
            })
        }

      const existingMpesacode=await LoanModel.findOne({mpesaCode})
      if(existingMpesacode){
            return res.status(400).json({
                message:"Enter a valid code !!!",
                error:true,
                success:false
            })
        }
        //create loan
         const loan = await LoanModel.create({
            user: client._id,
            agent: agentId,
            amount,
            durationWeeks,
            mpesaCode
    });

   
       

    return res.status(200).json({
        message:"Loan via agent submitted successfully",
        error:false,
        success:true,
        data:loan
    })
    
        
       
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
    
}

export async function submitProcessingFee(req, res) {
    try {
        const userId = req.userId;
        const { mpesaCode } = req.body;

        // 1. Validate format (Mpesa codes are usually 10 chars)
        if (!mpesaCode || mpesaCode.length < 8) {
            return res.status(400).json({
                message: "Invalid Mpesa code format",
                error: true,
                success: false
            });
        }

        // 2. Prevent duplicate Mpesa codes
        const existingCode = await LoanModel.findOne({ mpesaCode });
        if (existingCode) {
            return res.status(400).json({
                message: "This Mpesa code has already been used",
                error: true,
                success: false
            });
        }

        // 3. Find user's active loan
        const loan = await LoanModel.findOne({
            user: userId,
            status: "pending"
        });

        if (!loan) {
            return res.status(404).json({
                message: "No pending loan found",
                error: true,
                success: false
            });
        }

        if (loan.feeStatus === "paid" || loan.feeStatus === "verified") {
            return res.status(400).json({
                message: "Processing fee already submitted",
                error: true,
                success: false
            });
        }

        // 4. Save Mpesa code
        loan.mpesaCode = mpesaCode.toUpperCase();
        loan.isFeePaid = true;
        loan.feeStatus = "paid";

        await loan.save();

        return res.status(200).json({
            message: "Processing fee submitted. Awaiting admin verification.",
            success: true,
            error: false,
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
//verfy processing fee
export async function verifyProcessingFee(req,res) {
    try {
        const {mpesaCode,action}=req.body


        const loan=await LoanModel.findOne({
            mpesaCode:mpesaCode,
            feeStatus:'paid'
        })
        if(!loan){
            return res.status(400).json({
                message: "No pending payment found for this code",
                success: false
            })
        }
        if(action==='approve'){
            loan.feeStatus='verified',
            loan.paymentVerified=true,
            loan.status="approved"

            //const interestRate = 0.1; // example 10% interest
            //loan.totalRepayment = loan.amount + loan.amount * interestRate;
            loan.totalRepayment = loan.amount 
            loan.balance = loan.totalRepayment;

         
            const now = new Date();
            loan.dueDate = new Date(now.getTime() + loan.durationWeeks * 7 * 24 * 60 * 60 * 1000);
            loan.repaymentStatus = "not_started";
        
        } else if (action === "reject") {
            loan.feeStatus = "rejected";
            loan.isFeePaid = false;
            loan.paymentVerified = false;
        } else {
            return res.status(400).json({
                message: "Invalid action",
                success: false
            });
        }
        await loan.save()

         return res.status(200).json({
            message: `Fee ${action}d successfully`,
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
//admin get all loans
export async function getAllLoans(req,res){
    try {
        const adminId=req.userId

        const loans=await LoanModel.find().populate('agent','name email status nationalId').populate('user','name status nationalId').sort({createdAt:-1})

        if(!loans){
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
            status: { $in: ["pending", "approved"] }
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