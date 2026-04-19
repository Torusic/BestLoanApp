import React, { useState } from "react";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";
import { LuLoader } from "react-icons/lu";

function Disburse({ loan, close, fetch }) {
  const [loading, setLoading] = useState(false);

  const handleDisburse = async () => {
    if (!loan?._id) return toast.error("Invalid loan data");

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.disburse,
        data: {
          loanId: loan._id,
        },
      });

      if (response.data.success) {
        toast.success("Loan disbursed successfully ✅");
        fetch?.();
        close?.();
      } else {
        toast.error(response.data.message || "Disbursement failed");
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 text-white">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Disburse Loan</h2>
          <p className="text-xs text-gray-400">
            Confirm before sending funds to customer
          </p>
        </div>

        {/* LOAN DETAILS */}
        <div className="bg-gray-800 p-4 rounded-xl text-sm space-y-2">

          <div className="flex justify-between">
            <span className="text-gray-400">Customer</span>
            <span className="font-medium">
              {loan?.user?.name || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="text-green-400 font-semibold">
              KES {loan?.amount || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Duration</span>
            <span>{loan?.durationWeeks || 0} weeks</span>
          </div>

        </div>

        {/* WARNING */}
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-xs text-yellow-300">
          ⚠️ This action cannot be reversed once disbursed.
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={close}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleDisburse}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <LuLoader className="animate-spin" size={16} />}
            {loading ? "Processing..." : "Confirm Disbursement"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Disburse;