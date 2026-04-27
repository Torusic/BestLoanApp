import React, { useEffect, useState } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

import AddLoan from "./actions/AddLoan";
import Approve from "./actions/Approve";
import Disburse from "./actions/Disburse";
import Reject from "./Reject.jsx";

import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";

function Loan() {
  const [customer, setCustomer] = useState(false);
  const [approve, setApprove] = useState(false);
  const [disburse, setDisburse] = useState(false);
  const [reject, setReject] = useState(false);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // FILTER STATE
  const [filter, setFilter] = useState("all");

  // ✅ FIXED: approved REMOVED from no action list
  const noActionNeeded = (status) => {
    return ["disbursed", "rejected", "repaid"].includes(status);
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getAllLoans,
      });

      if (response.data.success) {
        setLoans(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [loans, filter]);

  // ================= FILTER LOGIC =================
  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;

    if (filter === "active") {
      return ["awaiting_fee", "pending_approval", "approved", "disbursed"].includes(
        loan.status
      );
    }

    if (filter === "processing") return loan.status === "pending_approval";

    if (filter === "overdue") {
      return (
        loan.status === "disbursed" &&
        loan.dueDate &&
        new Date(loan.dueDate) < new Date()
      );
    }

    if (filter === "fully_repaid") return loan.status === "repaid";

    if (filter === "rejected") return loan.status === "rejected";

    return true;
  });

  const indexOfLast = currentPage * loansPerPage;
  const indexOfFirst = indexOfLast - loansPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor = (status) => {
    switch (status) {
      case "awaiting_fee":
        return "bg-yellow-500/20 text-yellow-400";
      case "pending_approval":
        return "bg-orange-500/20 text-orange-400";
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "disbursed":
        return "bg-blue-500/20 text-blue-400";
      case "repaid":
        return "bg-emerald-500/20 text-emerald-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const feeStatusStyle = (feeStatus) => {
  switch (feeStatus) {
    case "pending":
      return "bg-gray-500/10 text-gray-300 border-gray-600";

    case "submitted":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500";

    case "verified":
      return "bg-green-500/10 text-green-300 border-green-500";

    case "rejected":
      return "bg-red-500/10 text-red-300 border-red-500";

    default:
      return "bg-gray-700 text-gray-300 border-gray-600";
  }
};
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold">Loans</h1>
            <p className="text-gray-400 text-sm">
              Manage approvals, rejections and  disbursement ( . PROCESSING FEE)
            </p>
          </div>

          <button
            onClick={() => setCustomer(true)}
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 rounded-xl"
          >
            <IoAdd />
            Apply Loan for client
          </button>

        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto mb-5">
          {[
            "all",
            "active",
            "processing",
            "overdue",
            "fully_repaid",
            "rejected",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filter === type
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 mb-3">
          <IoSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search loan..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        {/* INFO */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <FaInfoCircle />
          Verify M-Pesa code before approving or rejecting loans.
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-gray-800">

          <table className="w-full text-sm">

            <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-4 text-left">#</th>
                <th className="px-4 py-4 text-left">Customer</th>
                <th className="px-4 py-4">Loan Amount</th>
                <th className="px-4 py-4">Interest Amount</th>
                <th className="px-4 py-4">Balance</th>
                <th className="px-4 py-4">Paid</th>
                <th className="px-4 py-4">Duration</th>
                
                <th className="px-4 py-4">Fee MPESA code</th>
                <th className="px-4 py-4">Fee Status</th>
                
                <th className="px-4 py-4"> Loan Status</th>
                <th className="px-4 py-4">Due Date</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">

              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-10">
                    <LuLoader className="animate-spin mx-auto text-xl" />
                  </td>
                </tr>
              ) : currentLoans.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-400">
                    No loans found
                  </td>
                </tr>
              ) : (
                currentLoans.map((loan, index) => (
                  <tr key={loan._id} className="hover:bg-gray-800/60">

                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{loan.user?.name}</td>
                    <td className="px-4 py-4 text-green-400">KES {loan.amount}</td>
                                        <td className="px-4 py-4 text-purple-400">
                    {loan.interestAmount}
                  </td>
                    <td className="px-4 py-4 text-red-400">KES {loan.balance || 0}</td>
                    <td className="px-4 py-4 text-blue-400">{loan.amountPaid}</td>
                    
                    <td className="px-4 py-4">{loan.durationWeeks}</td>

 
                    <td className="px-4 py-4">{loan.mpesaCode || "N/A"}</td>
                   <td className="px-4 py-4">

                    <span
                      className={`flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-md border font-medium uppercase tracking-wide ${feeStatusStyle(
                        loan.feeStatus
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {loan.feeStatus}
                    </span>

                  </td>

                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-400">
                      {formatDate(loan.dueDate)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        {noActionNeeded(loan.status) ? (
                          <span className="text-xs px-3 py-1 flex items-center gap-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700">
                            <FaInfoCircle /> No action needed
                          </span>
                        ) : (
                          <>
                            {(loan.status === "pending_approval" ||
                              loan.status === "awaiting_fee") && (
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setApprove(true);
                                }}
                                className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded-lg"
                              >
                                Approve
                              </button>
                            )}

                            {(loan.status === "pending_approval" ||
                              loan.status === "awaiting_fee") && (
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setReject(true);
                                }}
                                className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded-lg"
                              >
                                Reject
                              </button>
                            )}

                            {loan.status === "approved" && (
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setDisburse(true);
                                }}
                                className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-lg"
                              >
                                Disburse
                              </button>
                            )}
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>

      </div>

      {/* MODALS */}
      {customer && <AddLoan close={() => setCustomer(false)} fetch={fetchLoans} />}
      {approve && <Approve loan={selectedLoan} close={() => setApprove(false)} fetch={fetchLoans} />}
      {disburse && <Disburse loan={selectedLoan} close={() => setDisburse(false)} fetch={fetchLoans} />}
      {reject && <Reject loan={selectedLoan} close={() => setReject(false)} fetch={fetchLoans} />}

    </section>
  );
}

export default Loan;