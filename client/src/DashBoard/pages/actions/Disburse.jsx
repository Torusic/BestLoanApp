import React, { useState } from "react";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";
import { LuLoader } from "react-icons/lu";

function Disburse({ loan, close, fetch }) {
  const [loading, setLoading] = useState(false);

  const handleDisburse = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.disburse,
        data: {
          loanId: loan._id, // important
        },
      });

      if (response.data.success) {
        toast.success("Loan disbursed ✅");
        fetch(); // refresh loans list
        close(); // close modal
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Disburse Loan
        </h2>

        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Customer:</strong> {loan?.user?.name || "Loading..."}
          </p>
          <p>
            <strong>Amount:</strong> KES {loan?.amount || 0}
          </p>
          <p>
            <strong>Duration:</strong> {loan?.durationWeeks || 0} weeks
          </p>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Are you sure you want to disburse this loan?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleDisburse}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            {loading && <LuLoader className="animate-spin" />}
            {loading ? "Disbursing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Disburse;