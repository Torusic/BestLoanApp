import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import LoanModel from "../models/loan.model.js";


//register user
export  async function registerController(req,res){
    try {
        const{name,email,phone,password,nationalId}=req.body;
        const userExist=await UserModel.findOne({$or:[{email},{phone},{nationalId}]})
        if(userExist){
            return res.status(400).json({
                message:'User Already Exist',
                error:true,
                success:false
            })
        }
        const  salt=await bcryptjs.genSalt(10)  
        const hashPassword=await bcryptjs.hash(password,salt);
        
        const payload={
            name,
            email,
            phone,
            password:hashPassword,
            nationalId
        }
        const newUser= await UserModel(payload)
        const save=newUser.save()

        return res.status(200).json({
            message:'User Registered Successfully',
            error:false,
            success:true,
            data:newUser
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }

}

//login user
export  async function loginController(req,res){
    try {
        const{phone,password}=req.body

        const user=await UserModel.findOne({phone})

        if(!user){
            return res.status(400).json({
                message:"User does not exist",
                error:true,
                success:false
            })
        }
        const checkPassword=await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return res.status(400).json({
                message:"Invalid Password",
                error:true,
                success:false
            })
        }
        const accessToken=await generatedAccessToken(user._id)
        const refreshToken=await generatedRefreshToken(user._id)

        const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date:new Date()
        })

        const cookiesOptions={
                    httpOnly:true,
                    secure:true,
                    sameSite:"None",
        
                }
        
                res.cookie("accessToken",accessToken,cookiesOptions);
                res.cookie("refreshToken",refreshToken,cookiesOptions);
        
                return res.status(200).json({
                    message:"User logged in Successfully",
                    error:false,
                    success:true,
                    data:{
                        accessToken,
                        refreshToken,
                        role: user.role, // <-- add this
                        name: user.name  
                    }
                })
        
    } catch (error) {
          return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
//get All Agents
export async function getAllAgents(req,res){
    try {
        const agents=await UserModel.find({role:'agent'}).select('-password')

        if(!agents){
            return res.status(400).json({
                message:"Agents not found",
                error:true,
                success:false,
                
            })
        }
    return res.status(200).json({
        message:"All Clients fetched",
        error:false,
        success:true,
        data:{
            count:agents.length,
            agents
        }
        
    })
         
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}

//get All Agents
export async function getAllClients(req,res){
    try {
        const clients=await UserModel.find({role:'client'}).select('-password')

        if(!clients){
            return res.status(400).json({
                message:"Clients not found",
                error:true,
                success:false,
                
            })
        }
    return res.status(200).json({
        message:"All agents fetched",
        error:false,
        success:true,
        data:{
            count:clients.length,
            clients
        }
        
    })
         
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
//admin add agents
export async function adminAddAgents(req,res){
    try {
        
        const{name,email,phone,nationalId}=req.body;

        const agent=await UserModel.findOne({$or:[{nationalId},{phone}]})
        if(agent){
            return res.status(400).json({
                message:"agent already exist ",
                error:true,
                success:false
            })
        }
        const hashedPassword = await bcryptjs.hash("1234", 10);
        const newAgent=await UserModel.create({
            name,
            email,
            phone,
            nationalId,
            password:hashedPassword,
            role:'agent'
        })
        await newAgent.save();

        return res.status(200).json({
            message:"agent added Successfully",
            error:false,
            success:true
        })

        
    } catch (error) {
         return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

//admin stats
export async function adminDashboardController(req, res) {
  try {
    // Get all users
    const agents = await UserModel.find({ role: 'agent' });
    const clients = await UserModel.find({ role: 'client' });

    // Get all loans
    const loans = await LoanModel.find();

    // Counts
    const loansDisbursed = loans.filter(l => l.status === "disbursed").length;
    const loansPending = loans.filter(l => l.status === "pending_approval").length;
    const loansRejected = loans.filter(l => l.status === "rejected").length;
    const totalProcessingFeesVerified = loans.filter(l => l.feeStatus === "verified").length;
    const totalProcessingFeesPending = loans.filter(l => l.feeStatus === "paid").length;
    const totalOverdueLoans = loans.filter(l => l.repaymentStatus === "overdue").length;

    // Amount calculations
    const totalAmountIssued = loans
      .filter(l => l.status === "disbursed")
      .reduce((sum, l) => sum + l.amount, 0);

    const totalAmountRepaid = loans.reduce((sum, l) => sum + (l.amountPaid || 0), 0);

    const totalOverdueAmount = loans
      .filter(l => l.repaymentStatus === "overdue")
      .reduce((sum, l) => sum + (l.balance || 0), 0);

    const activeLoans = loans.filter(l => l.status === "pending" || l.status === "approved"||l.status === "disbursed").length;

    // Optional: Aggregate per agent
    const agentStats = await Promise.all(
      agents.map(async agent => {
        const agentLoans = loans.filter(l => l.agent?.toString() === agent._id.toString());
        return {
          agentId: agent._id,
          name: agent.name,
          totalLoans: agentLoans.length,
          totalAmountIssued: agentLoans.reduce((sum, l) => sum + l.amount, 0),
        };
      })
    );

    return res.status(200).json({
      message: "Admin dashboard fetched successfully",
      error: false,
      success: true,
      data: {
        totalClients: clients.length,
        totalAgents: agents.length,
        loansDisbursed,
        loansPending,
        loansRejected,
        totalProcessingFeesVerified,
        totalProcessingFeesPending,
        totalOverdueLoans,
        totalAmountIssued,
        totalAmountRepaid,
        totalOverdueAmount,
        activeLoans,
        agentStats
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}