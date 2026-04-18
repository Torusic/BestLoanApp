import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import ProcessingFee from "../ProcessingFee";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(num || 0);

const statusMeta = (status) => {
  switch (status) {
    case "approved":
      return { color: "text-green-400", bg: "bg-green-500/10" };
    case "pending_approval":
      return { color: "text-yellow-400", bg: "bg-yellow-500/10" };
    case "disbursed":
      return { color: "text-blue-400", bg: "bg-blue-500/10" };
    case "rejected":
      return { color: "text-red-400", bg: "bg-red-500/10" };
    default:
      return { color: "text-gray-400", bg: "bg-gray-500/10" };
  }
};

const ActiveLoanSkeleton = () => (
  <div className="bg-gray-900 p-4 rounded-xl animate-pulse space-y-3">
    <div className="h-4 w-40 bg-gray-700 rounded" />
    <div className="h-20 bg-gray-800 rounded" />
    <div className="h-10 bg-gray-800 rounded" />
    <div className="h-4 w-32 bg-gray-700 rounded" />
  </div>
);

function ActiveLoan() {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [fee, setFee] = useState(false);

  const fetchActiveLoans = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);

      const response = await Axios({
        ...SummaryApi.myLoan,
      });

      if (response.data.success) {
        setActive(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load loan");
      }
    } catch (error) {
      setError("Unable to load loan data");
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveLoans();
  }, [fetchActiveLoans]);

  const progress = useMemo(() => {
    if (!active) return 0;
    if (!active.totalRepayment) return 0;
    return Math.min(
      100,
      Math.round((active.amountPaid / active.totalRepayment) * 100)
    );
  }, [active]);

  const status = useMemo(() => {
    if (!active) return null;
    return statusMeta(active.status);
  }, [active]);

  return (
    <section className="max-w-4xl mx-auto p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Active Loan</h2>

        <button
          onClick={fetchActiveLoans}
          className="text-xs px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-3">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <ActiveLoanSkeleton />
      ) : !active ? (
        <div className="bg-gray-900 text-gray-400 p-6 rounded-xl text-center">
          No active loan found
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white p-3 rounded-xl border border-gray-800 space-y-4"
        >
          {/* Status */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Loan Overview</p>
            <span
              className={`text-xs px-3 py-1 rounded-full ${status?.color} ${status?.bg}`}
            >
              {active.status}
            </span>
          </div>

          {/* Progress */}
          <div className="w-full bg-gray-800 h-2 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">Repayment Progress: {progress}%</p>

          {/* Main Info */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-1 text-sm">
            <p>Amount: {formatCurrency(active.amount)}</p>
            <p>Duration: {active.durationWeeks} weeks</p>
            <p>
              Due Date: {active.dueDate
                ? new Date(active.dueDate).toDateString()
                : "Not set"}
            </p>
          </div>

          {/* Fee */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm">
              Processing Fee: {active.isFeePaid ? "Paid" : "Pending"}
            </p>

            {!active.isFeePaid && (
              <button
                onClick={() => setFee(true)}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-sm py-2 rounded-lg"
              >
                Pay Fee ({formatCurrency(active.processingFee)})
              </button>
            )}
          </div>

          {/* Toggle */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-400 text-xs"
          >
            {showMore ? "Hide Details" : "View Details"}
          </button>

          {/* More */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-800 p-4 rounded-lg text-sm space-y-1"
              >
                <p>Total Repayment: {formatCurrency(active.totalRepayment)}</p>
                <p>Paid: {formatCurrency(active.amountPaid)}</p>
                <p>Balance: {formatCurrency(active.balance)}</p>
                <p>Repayment: {active.repaymentStatus}</p>
                <p>Fee Status: {active.feeStatus}</p>
                <p>Disbursed: {active.isDisbursed ? "Yes" : "No"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      {fee && (
        <ProcessingFee
          loan={active}
          onClose={() => setFee(false)}
          refresh={fetchActiveLoans}
        />
      )}
    </section>
  );
}

export default ActiveLoan;