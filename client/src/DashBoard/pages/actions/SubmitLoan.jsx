import React, { useState } from "react";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SummaryApi from "../../../common/SummaryApi";
import Axios from "../../../utils/Axios";

export default function SubmitLoan({ onClose }) {
  const [form, setForm] = useState({
    nationalId: "",
    amount: "",
    durationWeeks: "",
    mpesaCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.nationalId || !form.amount || !form.durationWeeks || !form.mpesaCode) {
      setError("All fields are required");
      return false;
    }

    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setSuccess(null);

      const response = await Axios({
        ...SummaryApi.applyLoanForCustomer,
        data: form,
      });

      if (response.data.success) {
        setSuccess("Loan submitted successfully");
        setForm({ nationalId: "", amount: "", durationWeeks: "", mpesaCode: "" });
      }
    } catch (err) {
      AxiosToastError(err);
      setError(err?.response?.data?.message || "Failed to submit loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 p-2 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 w-full max-w-md rounded-2xl p-6 border border-gray-800"
      >
        <h2 className="text-xl font-bold mb-1">Submit Loan</h2>
        <p className="text-gray-400 text-sm mb-4">
          Enter client loan details for approval
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-700 p-2 rounded mb-3 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-3">
          <input
            name="nationalId"
            value={form.nationalId}
            onChange={handleChange}
            placeholder="Client National ID"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />

          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Loan Amount"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />

          <input
            name="durationWeeks"
            type="number"
            value={form.durationWeeks}
            onChange={handleChange}
            placeholder="Duration (Weeks)"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />

          <input
            name="mpesaCode"
            value={form.mpesaCode}
            onChange={handleChange}
            placeholder="M-Pesa Transaction Code"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Submitting..." : "Submit Loan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
