import axios from "axios";
import LoanModel from "../models/loan.model.js";

export async function makeProcessingFee(req, res) {
  try {
    const {  amount } = req.body;

    // Find loan and populate user to get phone
    const loan = await LoanModel.findOne({
      user:req.userId,
      status:"pending"

    }).populate("user");
    if (!loan) {
      return res.status(400).json({
        message: "Loan not found",
        error: true,
        success: false
      });
    }

    // Validate the amount against processingFee
    if (amount !== loan.processingFee) {
      return res.status(400).json({
        message: `Invalid amount. The processing fee is ${loan.processingFee}`,
        error: true,
        success: false
      });
    }

    const mpesaShortCode = process.env.MPESA_SHORTCODE;
    const passKey = process.env.MPESA_PASSKEY;
    if (!mpesaShortCode || !passKey) {
      return res.status(400).json({
        message: "Landlord M-Pesa not configured",
        error: true,
        success: false
      });
    }

    // Get client phone from populated user
    const clientPhone = loan.user.phone.startsWith("0")
      ? loan.user.phone.slice(1)
      : loan.user.phone;

    // Generate timestamp
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    // Generate password for STK Push
    const password = Buffer.from(mpesaShortCode + passKey + timestamp).toString("base64");

    console.log("Token used for STK Push:", req.mpesaToken);
    // Send STK Push request
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: mpesaShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${clientPhone}`,
        PartyB: mpesaShortCode,
        PhoneNumber: `254${clientPhone}`,
        CallBackURL: "https://bestloanapp.onrender.com/api/mpesa/callback",
        AccountReference: "Best Loan App",
        TransactionDesc: "Loan Processing Fee - Best Loan"
      },
      {
        headers: {
          Authorization: `Bearer ${req.mpesaToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Save STK Request ID for verification
    loan.stkRequestId = response.data.CheckoutRequestID;
    await loan.save();

    return res.status(200).json({
      message: "STK Push sent to your phone",
      success: true,
      data: response.data
    });
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);

  return res.status(400).json({
    message: error.response?.data || error.message,
    error: true,
    success: false
  });
}
}
export const mpesaCallback = async (req, res) => {
  try {
    const data = req.body;

    // Extract relevant info from M-Pesa callback
    const result = data.Body?.stkCallback;
    if (!result) return res.status(400).json({ message: "Invalid callback format" });

    const checkoutRequestId = result.CheckoutRequestID;
    const resultCode = result.ResultCode;
    const resultDesc = result.ResultDesc;
    const mpesaCode = result.CallbackMetadata?.Item?.find(item => item.Name === "MpesaReceiptNumber")?.Value;

    // Find loan using STK Request ID
    const loan = await LoanModel.findOne({ stkRequestId: checkoutRequestId }).populate("user");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Only process successful payments
    if (resultCode === 0) {
      // Prevent duplicate Mpesa codes
      const existingCode = await LoanModel.findOne({ mpesaCode });
      if (existingCode) {
        return res.status(400).json({ message: "This Mpesa code has already been used" });
      }

      loan.mpesaCode = mpesaCode;
      loan.isFeePaid = true;
      loan.feeStatus = "paid"; 
       loan.status = "awaiting_approval";
      await loan.save();

      return res.status(200).json({ message: "Processing fee recorded successfully" });
    } else {
      return res.status(400).json({ message: `Payment failed: ${resultDesc}` });
    }
  } catch (error) {
    console.log("Callback Error:", error);
    return res.status(500).json({ message: error.message || error });
  }
};