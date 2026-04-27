import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import ProcessingFee from "../ProcessingFee";
import RepaymentModal from "./RepaymentModal";

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
    case "repaid":
      return { color: "text-emerald-400", bg: "bg-emerald-500/10" };
    case "awaiting_fee":
      return { color: "text-orange-400", bg: "bg-orange-500/10" };
    default:
      return { color: "text-gray-400", bg: "bg-gray-500/10" };
  }
};

const Skeleton = () => (
  <div className="bg-gray-900 p-4 rounded-xl animate-pulse space-y-3">
    <div className="h-4 w-40 bg-gray-700 rounded" />
    <div className="h-20 bg-gray-800 rounded" />
    <div className="h-10 bg-gray-800 rounded" />
  </div>
);

function ActiveLoan() {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fee, setFee] = useState(false);
  const [repay, setRepay] = useState(false);

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
        setActive(null);
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

  // SAFE PROGRESS CALCULATION
  const progress = useMemo(() => {
    if (!active || !active.totalRepayment) return 0;

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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Active Loan</h2>

        <button
          onClick={fetchActiveLoans}
          className="text-xs px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-3">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <Skeleton />
      ) : !active ? (
        <div className="bg-gray-900 text-gray-400 p-6 rounded-xl text-center">
          No active loan found
        </div>
      ) : active.status === "repaid" ? (

        /* REPAID */
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl text-center">
          🎉 Congratulations! You fully repaid your loan.
          <div className="mt-4">
            <a
              href="/clientStats/apply"
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-white text-sm"
            >
              Apply for New Loan
            </a>
          </div>
        </div>

      ) : active.status === "rejected" ? (

        /* REJECTED */
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
          ❌ Your loan application was rejected.
          <div className="mt-4">
            <a
              href="/clientStats/apply"
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white text-sm"
            >
              Apply Again
            </a>
          </div>
        </div>

      ) : (

        /* ACTIVE LOAN */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white p-3 rounded-xl border border-gray-800 space-y-4"
        >

          {/* STATUS */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Loan Status</span>
            <span className={`text-xs px-3 py-1 rounded-full ${status?.color} ${status?.bg}`}>
              {active.status}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="w-full bg-gray-800 h-2 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-blue-400">
                {formatCurrency(active.amountPaid)}
              </p>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-red-400">
                {formatCurrency(active.balance)}
              </p>
            </div>
          </div>

          {/* LOAN INFO */}
          <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-1">
            <p>Amount: {formatCurrency(active.amount)}</p>

            <p>
              Interest:{" "}
              <span className="text-yellow-400">
                {formatCurrency(active.interestAmount || 0)}
              </span>
            </p>

            <p>
              Total Repayment:{" "}
              <span className="text-green-400">
                {formatCurrency(active.totalRepayment || 0)}
              </span>
            </p>

            <p>Duration: {active.durationWeeks} weeks</p>

            <p>
              Due Date:{" "}
              {active.dueDate
                ? new Date(active.dueDate).toDateString()
                : "Not set"}
            </p>
          </div>

          {/* PROCESSING FEE */}
          {active.status === "awaiting_fee" && !active.isFeePaid && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
              <p className="text-sm mb-2">
                Processing Fee: {formatCurrency(active.processingFee)}
              </p>

              <button
                onClick={() => setFee(true)}
                className="w-full bg-orange-500 hover:bg-orange-400 text-black py-2 rounded-lg text-sm"
              >
                Pay Processing Fee
              </button>
            </div>
          )}

          {/* REPAY BUTTON */}
          {active.isDisbursed && active.balance > 0 && (
            <button
              onClick={() => setRepay(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg"
            >
              Pay Loan ({formatCurrency(active.balance)})
            </button>
          )}

        </motion.div>
      )}

      {/* MODALS */}
      {fee && (
        <ProcessingFee
          loan={active}
          onClose={() => setFee(false)}
          refresh={fetchActiveLoans}
        />
      )}

      {repay && (
        <RepaymentModal
          loan={active}
          onClose={() => setRepay(false)}
          refresh={fetchActiveLoans}
        />
      )}

    </section>
  );
}

export default ActiveLoan;