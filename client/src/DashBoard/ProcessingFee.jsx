import React, { useState } from "react";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { LuLoader } from "react-icons/lu";
import { FaCopy } from "react-icons/fa";

function ProcessingFee({ loan, onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [mpesaCode, setMpesaCode] = useState("");

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const handleSubmit = async () => {
    if (!mpesaCode.trim()) {
      return toast.error("Enter MPESA transaction code");
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.submitProcessingFee,
        data: {
          mpesaCode,
          amount: loan.processingFee
        }
      });

      if (response.data.success) {
        toast.success("Payment submitted successfully");
        refresh();
        onClose();
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-green-400">
            Processing Fee Payment
          </h2>
          <p className="text-xs text-gray-400">
            Complete payment to proceed with your loan
          </p>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-sm text-gray-200">

          {/* Amount */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-gray-400 text-xs">Amount to Pay</p>
            <p className="text-xl font-bold text-green-400">
              KES {loan.processingFee}
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-2 bg-gray-800 p-3 rounded-lg">

            <div className="flex justify-between items-center">
              <span>Paybill</span>
              <div className="flex items-center gap-2">
                <span className="text-green-300">{loan.paybillNumber}</span>
                <button onClick={() => copyText(loan.paybillNumber)}>
                  <FaCopy className="text-xs text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Account</span>
              <div className="flex items-center gap-2">
                <span className="text-green-300">{loan.accountNumber}</span>
                <button onClick={() => copyText(loan.accountNumber)}>
                  <FaCopy className="text-xs text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

          </div>

          {/* Input */}
          <div>
            <label className="text-xs text-gray-400">
              MPESA Transaction Code
            </label>
            <input
              type="text"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value)}
              placeholder="e.g. QH12AB34CD"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-green-500"
            />
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500">
            Ensure the code is correct before submission. It will be verified before approval.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-700 flex gap-2">

          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-1/2 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <LuLoader className="animate-spin" />}
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProcessingFee;