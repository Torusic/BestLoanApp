import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import LoanModel from "../models/loan.model.js";
import { formatPhone } from "../utils/formatPhone.js";


//register user
export async function registerController(req, res) {
  try {
    let { name, email, phone, password, nationalId } = req.body;

    // Basic validation
    if (!name || !phone || !password || !nationalId) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    // ✅ FORMAT PHONE (single source of truth)
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({
        message: "Invalid phone number format",
        success: false,
      });
    }

    // Check if user exists
    const userExist = await UserModel.findOne({
      $or: [{ email }, { phone: formattedPhone }, { nationalId }],
    });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = new UserModel({
      name,
      email,
      phone: formattedPhone, // ✅ ALWAYS SAVED CLEAN
      password: hashPassword,
      nationalId,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  }
}

//login user
export async function loginController(req, res) {
  try {
    let { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
        success: false,
      });
    }

    // ✅ FORMAT PHONE
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({
        message: "Invalid phone number format",
        success: false,
      });
    }

    // IMPORTANT: include password
    const user = await UserModel.findOne({ phone: formattedPhone }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    // Check password
    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Generate tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
      refresh_token: refreshToken,
    });

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: {
        role: user.role,
        name: user.name,
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
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
        const clients=await UserModel.find({role:'client'}).select('-password').sort({createdAt:-1})

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
export async function adminAddAgents(req, res) {
  try {
    const { name, email, phone, nationalId } = req.body;

    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({
        message: "Invalid phone number",
        success: false,
      });
    }

    const agent = await UserModel.findOne({
      $or: [{ nationalId }, { phone: formattedPhone }],
    });

    if (agent) {
      return res.status(400).json({
        message: "Agent already exists",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash("1234", 10);

    const newAgent = await UserModel.create({
      name,
      email,
      phone: formattedPhone, // ✅ CLEAN STORAGE
      nationalId,
      password: hashedPassword,
      role: "agent",
    });

    return res.status(200).json({
      message: "Agent added successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
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
export async function updateProfileController(req, res) {
  try {
    const userId = req.userId; // from auth middleware
    const { name, email, phone, nationalId } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        nationalId,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      data: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function changePasswordController(req, res) {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function toggleNotificationController(req, res) {
  try {
    const userId = req.userId;
    const { notifications } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { notifications },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Notification preference updated",
      success: true,
      error: false,
      data: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
} 
export async function getUserSettingsController(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "User settings fetched",
      success: true,
      error: false,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function logoutController(req,res){
  try {
    const userId=req.userId;

    const cookiesOptions={
      httpOnly:true,
      secure:true,
      sameSite:'None'
    }

    res.clearCookie("accessToken",cookiesOptions)
    res.clearCookie("refreshToken",cookiesOptions)

    const removeRefreshToken=await UserModel.findByIdAndUpdate(userId,{
      refresh_token:""
    });

    return res.status(200).json({
      message:"User logged out successfully",
      error:false,
      success:true
    })


  } catch (error) {
    return res.status(500).json({
      message:error.message||error,
      success:false,
      error:true
    })
    
  }
}