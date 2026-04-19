import React, { useState } from "react";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";
import { LuLoader } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

function ApproveRepayment({ repayment, close, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.verifyRepayment,
        data: {
          repaymentId: repayment._id,
          status, // ✅ ONLY THIS
        },
      });

      if (response.data.success) {
        toast.success(
          status === "verified"
            ? "Repayment approved ✅"
            : "Repayment rejected ❌"
        );

        refresh();
        close();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!repayment) return null;

  return (
    <div className="fixed inset-0 z-50 p-2 bg-black/70 flex items-center justify-center">

      <div className="bg-gray-900 w-full max-w-md p-6 rounded-xl text-white">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Verify Repayment</h2>

          <button onClick={close}>
            <IoClose />
          </button>
        </div>

        {/* DETAILS */}
        <div className="bg-gray-800 p-3 rounded-lg text-sm space-y-2">
          <p>Customer: {repayment.user?.name}</p>
          <p>Amount: KES {repayment.amount}</p>
          <p>Code: {repayment.mpesaCode}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">

          <button
            onClick={close}
            className="w-full bg-gray-700 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => handleAction("rejected")}
            disabled={loading}
            className="w-full bg-red-600 py-2 rounded-lg"
          >
            Reject
          </button>

          <button
            onClick={() => handleAction("verified")}
            disabled={loading}
            className="w-full bg-green-600 py-2 rounded-lg flex justify-center"
          >
            {loading ? <LuLoader className="animate-spin" /> : "Approve"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ApproveRepayment;