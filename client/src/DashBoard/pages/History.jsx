import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClock 
} from "react-icons/fa";

const statusStyles = {
  active: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
  fully_repaid: "bg-green-100 text-green-700",
  processing: "bg-gray-100 text-gray-700",
  rejected: "bg-red-200 text-red-800",
};

const statusIcons = {
  active: <FaSpinner className="animate-spin" />,
  overdue: <FaExclamationTriangle />,
  fully_repaid: <FaCheckCircle />,
  processing: <FaClock />,
  rejected: <FaExclamationTriangle />,
};

// ✅ ADD HERE
const statusLabels = {
  active: "Active",
  overdue: "Overdue",
  fully_repaid: "Repaid",
  processing: "Processing",
  rejected: "Rejected",
};
const SkeletonCard = () => (
  <div className="bg-gray-900 rounded-2xl p-4 animate-pulse border border-gray-800">
    <div className="h-5 w-40 bg-gray-700 rounded mb-3"></div>
    <div className="h-3 w-24 bg-gray-700 rounded mb-4"></div>
    <div className="h-2 w-full bg-gray-700 rounded mb-4"></div>
    <div className="flex justify-between">
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function LoanHistoryCards() {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await Axios({
          ...SummaryApi.loanHistory,
        });

        if (response.data.success) {
         const formatted = response.data.data.map((loan) => {
          let loanType = "processing";

          // ✅ PRIORITY: backend status
          if (loan.status === "rejected") {
            loanType = "rejected";
          } else if (loan.status === "repaid") {
            loanType = "fully_repaid";
          } 
          // fallback logic
          else if (loan.balance === 0 && loan.isDisbursed) {
            loanType = "fully_repaid";
          } else if (
            loan.dueDate &&
            loan.balance > 0 &&
            new Date(loan.dueDate) < new Date()
          ) {
            loanType = "overdue";
          } else if (loan.isDisbursed && loan.balance > 0) {
            loanType = "active";
          }

          return {
            _id: loan._id,
            amount: loan.amount,
            durationWeeks: loan.durationWeeks,
            amountPaid: loan.amountPaid,
            balance: loan.balance,
            dueDate: loan.dueDate
              ? new Date(loan.dueDate).toISOString().split("T")[0]
              : null,
            loanType,
          };
        });

          setLoans(formatted);
          toast.success("Loans loaded");
        }
      } catch (error) {
        AxiosToastError(error);
        setError("Failed to load loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const filteredLoans =
    filter === "all"
      ? loans
      : loans.filter((l) => l.loanType === filter);

  return (
    <div className="min-h-screen bg-gray-800 rounded p-5">

      <h1 className="text-2xl text-white font-bold mb-4">
        My Loans
      </h1>

      {error && (
        <div className="text-red-400 mb-3 text-sm">{error}</div>
      )}

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto mb-5">
        {["all", "active", "overdue", "fully_repaid", "processing","rejected"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                filter === type
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* CARDS */}
      {!loading && (
        <div className="grid gap-4">
          {filteredLoans.map((loan) => (
            <div
              key={loan._id}
              className="bg-gray-900 rounded-2xl text-white p-4 border border-gray-800 hover:scale-[1.01] transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-center mb-3">

                <div>
                  <h2 className="font-bold text-lg">
                    KSh {loan.amount.toLocaleString()}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {loan.durationWeeks} weeks loan
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[loan.loanType]
                  }`}
                >
                  {statusIcons[loan.loanType]}
                  <span>{statusLabels[loan.loanType]}</span>
                </div>

              </div>

              {/* PROGRESS */}
              <div className="w-full bg-gray-700 h-2 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (loan.amountPaid / loan.amount) * 100 || 0
                    }%`,
                  }}
                />
              </div>

              {/* STATS */}
              <div className="flex justify-between text-sm">

                <div>
                  <p className="text-gray-400">Paid</p>
                  <p className="text-green-500 font-semibold">
                    KSh {loan.amountPaid}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Balance</p>
                  <p className="text-red-400 font-semibold">
                    KSh {loan.balance}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Due</p>
                  <p>{loan.dueDate || "N/A"}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredLoans.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No loans found
        </div>
      )}

    </div>
  );
}