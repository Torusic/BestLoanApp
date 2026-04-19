import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";

function RepaymentModal({ loan, onClose, refresh }) {
  const [form, setForm] = useState({
    amount: "",
    mpesaCode: ""
  });

  const [loading, setLoading] = useState(false);

  if (!loan) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopy = (value, label) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.mpesaCode) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.submitRepayment,
        data: {
          loanId: loan._id,
          amount: form.amount,
          mpesaCode: form.mpesaCode
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        refresh();
        onClose();
      } else {
       toast.error(response.data.message || response.data.error);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES"
    }).format(num || 0);

  return (
    <div className="fixed  p-2 inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 animate-fadeIn space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Loan Repayment
            </h2>
            <p className="text-xs text-gray-400">
              Pay via M-Pesa then submit code
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <IoClose size={20} className="text-gray-400" />
          </button>
        </div>

        {/* BALANCE */}
        <div className="bg-gradient-to-r from-red-600 to-red-400 p-4 rounded-xl">
          <p className="text-sm text-white/80">Remaining Balance</p>
          <h3 className="text-white font-bold text-xl">
            {formatCurrency(loan?.balance)}
          </h3>
        </div>

        {/* PAYBILL DETAILS */}
        <div className="bg-gray-800 p-4 rounded-xl text-sm space-y-3">

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs">Paybill Number</p>
              <p className="text-white font-semibold">
                {loan?.paybillNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(loan?.paybillNumber, "Paybill")}
              className="text-xs  px-3 py-1 rounded-lg"
            >
              <FaCopy size={15} className="text-xs text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs">Account Number</p>
              <p className="text-white font-semibold">
                {loan?.accountNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(loan?.accountNumber, "Account number")}
              className="text-xs px-3 py-1 rounded-lg"
            >
              <FaCopy size={15} className="text-xs text-gray-400 hover:text-white" />
            </button>
          </div>

        </div>

        

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* AMOUNT */}
          <div>
            <label className="text-xs text-gray-400">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          {/* MPESA CODE */}
          <div>
            <label className="text-xs text-gray-400">
              M-Pesa Code
            </label>
            <input
              type="text"
              name="mpesaCode"
              value={form.mpesaCode}
              onChange={handleChange}
              placeholder="e.g QWE123XYZ"
              className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white uppercase"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-sm text-white"
            >
              Cancel
            </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 text-white"
              >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Submitting..." : "Submit Payment"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default RepaymentModal;