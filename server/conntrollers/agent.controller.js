import bcryptjs from "bcryptjs";
import LoanModel from "../models/loan.model.js";
import UserModel from "../models/user.model.js";
import { formatPhone } from "../utils/formatPhone.js";

// ✅ 1. Register Client (Agent Only)
export async function registerClientByAgent(req, res) {
  try {
    const agentId = req.userId;

    if (!agentId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    let { name, email, phone, nationalId } = req.body;

    // ✅ FORMAT PHONE (IMPORTANT FIX)
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({
        message: "Invalid phone number format",
        success: false
      });
    }

    // Check duplicates (normalize consistency)
    const existing = await UserModel.findOne({
      $or: [{ nationalId }, { phone: formattedPhone }]
    });

    if (existing) {
      return res.status(400).json({
        message: "Client already exists",
        success: false
      });
    }

    const client = await UserModel.create({
      name,
      email,
      phone: formattedPhone, // ✅ CLEAN STORAGE
      nationalId,
      password: await bcryptjs.hash("1234", 10),
      role: "client",
      createdBy: agentId
    });

    return res.status(201).json({
      success: true,
      message: "Client registered successfully",
      data: client
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function agentDashboardController(req, res) {
  try {
    const agentId = req.userId;

    const clients = await UserModel.find({
      role: "client",
      createdBy: agentId
    });

    const loans = await LoanModel.find({
      agent: agentId
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clientsToday = clients.filter(
      c => new Date(c.createdAt) >= today
    ).length;

    const loansToday = loans.filter(
      l => new Date(l.createdAt) >= today
    ).length;

    const pending = loans.filter(
      l => l.status === "pending_approval"
    ).length;

    const successful = loans.filter(
      l => l.status === "approved" || l.status === "disbursed"
    ).length;

    const recentActivities = loans
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(l => ({
        name: "Client",
        action:
          l.status === "pending_approval"
            ? "Loan Submitted"
            : l.status === "approved"
            ? "Loan Approved"
            : l.status === "disbursed"
            ? "Loan Disbursed"
            : "Updated",
        status:
          l.status === "pending_approval"
            ? "Pending"
            : l.status === "approved"
            ? "Approved"
            : l.status === "disbursed"
            ? "Success"
            : "Unknown"
      }));

    const alerts = [];

    if (pending > 0) {
      alerts.push(`${pending} applications pending approval`);
    }

    if (clients.length === 0) {
      alerts.push("No clients registered yet");
    }

    if (successful > 5) {
      alerts.push("Good performance: multiple successful submissions");
    }

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          clientsToday,
          loansToday,
          pending,
          successful
        },
        recentActivities,
        alerts
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function agentApplyLoan(req, res) {
  try {
    const agentId = req.userId;
    const { nationalId, amount, durationWeeks, mpesaCode } = req.body;

    if (!agentId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!nationalId || !amount || !durationWeeks || !mpesaCode) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const client = await UserModel.findOne({ nationalId });

    if (!client) {
      return res.status(404).json({ message: "Client not found", success: false });
    }

    // ownership check
    if (!client.createdBy || String(client.createdBy) !== String(agentId)) {
      return res.status(403).json({ message: "Unauthorized: Not your client", success: false });
    }

    const existingLoan = await LoanModel.findOne({
      user: client._id,
      status: { $in: ["pending_approval", "approved", "disbursed"] }
    });

    if (existingLoan) {
      return res.status(400).json({ message: "Client already has an active loan", success: false });
    }

    const loan = await LoanModel.create({
      user: client._id,
      agent: agentId,
      amount: Number(amount),
      durationWeeks: Number(durationWeeks),
      mpesaCode,
      status: "pending_approval",
      feeStatus: "verified",
      isFeePaid: true,
      paymentVerified: true,
      totalRepayment: Number(amount),
      balance: 0
    });

    return res.status(201).json({
      success: true,
      message: "Loan submitted successfully",
      data: { client: client.name, status: loan.status }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getMyClients(req, res) {
  try {
    const agentId = req.userId;

    const clients = await UserModel.find({
      role: "client",
      createdBy: agentId
    }).select("name phone nationalId createdAt");

    return res.status(200).json({
      success: true,
      data: clients
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
}


export async function getClientStatus(req, res) {
  try {
    const agentId = req.userId;
    const { nationalId } = req.params;

    const client = await UserModel.findOne({ nationalId });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false
      });
    }

    // Ownership check
    if (client.createdBy?.toString() !== agentId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false
      });
    }

    const loan = await LoanModel.findOne({
      user: client._id
    }).sort({ createdAt: -1 });

    let status = "No Loan";

    if (loan) {
      if (loan.status === "pending_approval") status = "Pending";
      else if (loan.status === "approved") status = "Approved";
      else if (loan.status === "disbursed") status = "Active";
      else if (loan.status === "rejected") status = "Rejected";
    }

    return res.status(200).json({
      success: true,
      data: {
        name: client.name,
        phone: client.phone,
        status   
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
}