import React, { useEffect, useState } from 'react'
import { IoAdd, IoSearch } from 'react-icons/io5'
import AddLoan from './actions/AddLoan'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'
import { LuLoader } from "react-icons/lu"
import { FaInfoCircle } from 'react-icons/fa'
import Approve from './actions/Approve'
import Disburse from './actions/Disburse'

function Loan() {
  const [customer, setCustomer] = useState(false)
  const [approve, setApprove] = useState(false)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [disburse, setDisburse] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const loansPerPage = 10

  const fetchLoans = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllLoans
      })

      if (response.data.success) {
        setLoans(response.data.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [loans])

  const indexOfLastLoan = currentPage * loansPerPage
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan)
  const totalPages = Math.ceil(loans.length / loansPerPage)

  const formatDate = (dateString) => {
    if (!dateString) return "Waiting for approval"

    const date = new Date(dateString)

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <section className='bg-gray-800 overflow-y-auto scrollbar-hidden'>
      <div className='bg-gray-800 p-2 lg:p-6 max-w-7xl mx-auto rounded-2xl shadow-sm'>

        {loading ? (
          <div className='flex justify-center py-10'>
            <LuLoader className='animate-spin text-xl' />
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className='fixed top-20 right-0 left-0 lg:left-65 bg-gray-800 mb-2 p-2 rounded-sm text-white'>

              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold'>Loans</h2>

                <button
                  onClick={() => setCustomer(true)}
                  className='flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl text-sm'
                >
                  <IoAdd />
                  Apply Loan
                </button>
              </div>

              <div className='bg-gray-700 flex items-center justify-between text-xs rounded p-2'>
                <input
                  type="text"
                  placeholder='search loan'
                  className='outline-none bg-transparent w-full'
                />
                <IoSearch />
              </div>

              <p className='flex items-center gap-2 text-xs my-2'>
                <FaInfoCircle size={18} />
                Verify the M-Pesa code before approving or rejecting.
              </p>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto mt-35">
              <table className='min-w-full'>

                <thead className='bg-gray-900 text-xs text-white'>
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 hidden md:table-cell">ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Balance</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">MPESA</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Fee</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Fee Status</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Due Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className='text-xs text-white'>
                  {currentLoans.map((loan) => {

                  const isAwaitingFee = loan.status === "awaiting_fee"
                  const isPendingApproval = loan.status === "pending_approval" || loan.status === "awaiting_fee"
                  const isApproved = loan.status === "approved"
                  const isDisbursed = loan.status === "disbursed"

                    return (
                      <tr key={loan._id} className='hover:bg-green-900'>

                        <td className="px-4 py-3 font-medium">
                          {loan.user?.name}
                        </td>

                        <td className="px-4 py-3 hidden md:table-cell">
                          {loan.user?.nationalId}
                        </td>

                        <td className="px-4 py-3 text-green-600 font-semibold">
                          KES {loan.amount}
                        </td>

                        <td className="px-4 py-3 text-red-500 font-semibold">
                          KES {loan.balance || 0}
                        </td>

                        <td className="px-4 py-3 text-blue-500 font-semibold">
                          KES {loan.amountPaid }
                        </td>

                        <td className="px-4 py-3">
                          {loan.durationWeeks} wks
                        </td>

                        <td className="px-4 py-3">
                          <span className="bg-gray-900 px-3 py-1 rounded text-xs">
                            {loan.mpesaCode || "N/A"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span className={`font-semibold px-2 py-1 rounded-xl
                            ${isAwaitingFee ? "bg-yellow-200 text-yellow-700"
                              : isPendingApproval ? "bg-orange-200 text-orange-700"
                                : isApproved ? "bg-green-200 text-green-700"
                                  : isDisbursed ? "bg-blue-200 text-blue-700"
                                    : "bg-red-200 text-red-600"}`}>
                            {loan.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          KES {loan.processingFee || 200}
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`text-xs font-semibold
                            ${loan.feeStatus === "verified"
                              ? "text-green-600"
                              : loan.feeStatus === "submitted"
                                ? "text-yellow-500"
                                : "text-red-500"}`}>
                            {loan.feeStatus}
                          </span>
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          {formatDate(loan.dueDate)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">

                            {/* APPROVE */}
{isPendingApproval && (
  <button
    onClick={() => {
      setSelectedLoan(loan)
      setApprove(true)
    }}
    className="px-3 py-1 bg-green-500 text-white rounded-lg"
  >
    Approve
  </button>
)}

{/* DISBURSE */}
{isApproved && !isDisbursed && (
  <button
    onClick={() => {
      setSelectedLoan(loan)
      setDisburse(true)
    }}
    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
  >
    Disburse
  </button>
)}

{/* REJECT */}
{(isAwaitingFee || isPendingApproval) && (
  <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
    Reject
  </button>
)}

                          </div>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-4 px-2 text-white">

              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-900 rounded disabled:opacity-40"
              >
                Prev
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-gray-900" : "bg-gray-700"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-900 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      {customer && (
        <AddLoan close={() => setCustomer(false)} fetch={fetchLoans} />
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
  )
}

export default Loan