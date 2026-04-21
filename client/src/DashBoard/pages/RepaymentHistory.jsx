import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";

export default function RepaymentHistory() {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await Axios({
        ...SummaryApi.getRepaymentHistory,
      });

      if (response.data.success) {
        setRepayments(response.data.data);
      }

      toast.success("Repayment history loaded");
    } catch (error) {
      AxiosToastError(error);
      setError("Failed to load repayment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const statusColor = {
    pending: "text-yellow-400",
    verified: "text-green-400",
    rejected: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-5">
        Repayment History
      </h1>

      {error && (
        <p className="text-red-400 mb-3">{error}</p>
      )}

      {loading && (
        <p className="text-gray-400">Loading repayments...</p>
      )}

      {!loading && repayments.length === 0 && (
        <p className="text-gray-400">No repayment records found</p>
      )}

      <div className="grid gap-4">
        {repayments.map((repay) => (
          <div
            key={repay._id}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">
                KSh {repay.amount?.toLocaleString()}
              </h2>

              <span
                className={`text-sm font-semibold ${
                  statusColor[repay.status] || "text-gray-400"
                }`}
              >
                {repay.status}
              </span>
            </div>

            {/* LOAN INFO */}
            <div className="text-sm text-gray-400 mb-2">
              Loan Amount: KSh {repay.loan?.amount?.toLocaleString()} <br />
              Balance: KSh {repay.loan?.balance?.toLocaleString()} <br />
              M-Pesa Code: {repay.mpesaCode}
            </div>

            {/* DATE */}
            <div className="text-xs text-gray-500">
              {new Date(repay.createdAt).toLocaleString()}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}