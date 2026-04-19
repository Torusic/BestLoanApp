import React, { useEffect, useState } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

import AddLoan from "./actions/AddLoan";
import Approve from "./actions/Approve";
import Disburse from "./actions/Disburse";

import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";

function Loan() {
  const [customer, setCustomer] = useState(false);
  const [approve, setApprove] = useState(false);
  const [disburse, setDisburse] = useState(false);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

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
  }, [loans]);

  const indexOfLast = currentPage * loansPerPage;
  const indexOfFirst = indexOfLast - loansPerPage;
  const currentLoans = loans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(loans.length / loansPerPage);

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
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold">Loans</h1>
            <p className="text-gray-400 text-sm">
              Manage approvals, disbursement and repayments
            </p>
          </div>

          <button
            onClick={() => setCustomer(true)}
            className="flex items-center gap-2 px-5 py-2.5 
            bg-gradient-to-r from-blue-600 to-blue-500 
            hover:from-blue-500 hover:to-blue-400 
            rounded-xl text-sm font-medium shadow-lg"
          >
            <IoAdd />
            Apply Loan
          </button>

        </div>

        {/* SEARCH BAR */}
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

            {/* HEADER */}
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-4 text-left">Customer</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Balance</th>
                <th className="px-4 py-4">Paid</th>
                <th className="px-4 py-4">Duration</th>
                <th className="px-4 py-4">MPESA</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Due Date</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-800">

              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10">
                    <LuLoader className="animate-spin mx-auto text-xl" />
                  </td>
                </tr>
              ) : currentLoans.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-400">
                    No loans found
                  </td>
                </tr>
              ) : (

                currentLoans.map((loan) => {

                  const isPending =
                    loan.status === "pending_approval" ||
                    loan.status === "awaiting_fee";

                  const isApproved = loan.status === "approved";
                  const isDisbursed = loan.status === "disbursed";

                  return (
                    <tr key={loan._id} className="hover:bg-gray-800/60 transition">

                      <td className="px-4 py-4 font-medium">
                        {loan.user?.name}
                      </td>

                      <td className="px-4 py-4 text-green-400">
                        KES {loan.amount}
                      </td>

                      <td className="px-4 py-4 text-red-400">
                        KES {loan.balance || 0}
                      </td>

                      <td className="px-4 py-4 text-blue-400">
                        KES {loan.amountPaid}
                      </td>

                      <td className="px-4 py-4">
                        {loan.durationWeeks} wks
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-300">
                        {loan.mpesaCode || "N/A"}
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
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">

                          {isPending && (
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                                setApprove(true);
                              }}
                              className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white"
                            >
                              Approve
                            </button>
                          )}

                          {isApproved && !isDisbursed && (
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                                setDisburse(true);
                              }}
                              className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white"
                            >
                              Disburse
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>
          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 text-sm">

          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(p => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

      {/* MODALS */}
      {customer && (
        <AddLoan
          close={() => setCustomer(false)}
          fetch={fetchLoans}
        />
      )}

      {approve && (
        <Approve
          loan={selectedLoan}
          close={() => setApprove(false)}
          fetch={fetchLoans}
        />
      )}

      {disburse && (
        <Disburse
          loan={selectedLoan}
          close={() => setDisburse(false)}
          fetch={fetchLoans}
        />
      )}

    </section>
  );
}

export default Loan;