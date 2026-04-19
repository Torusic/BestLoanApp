import React, { useEffect, useState } from 'react'
import SummaryApi from '../../common/SummaryApi'
import Axios from '../../utils/Axios'
import AxiosToastError from '../../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { MdAttachMoney } from 'react-icons/md'
import { Link } from 'react-router-dom'
import ProcessingFee from '../ProcessingFee'
import RepaymentModal from './RepaymentModal'

const MyLoanSkeleton = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse space-y-4">
      <div className="h-5 w-40 bg-gray-700 rounded"></div>
      <div className="h-24 bg-gray-700 rounded-xl"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-700 rounded-xl"></div>
        <div className="h-16 bg-gray-700 rounded-xl"></div>
      </div>
      <div className="h-10 bg-gray-700 rounded-xl"></div>
    </div>
  )
}

function MyLoan() {

  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [repay, setRepay] = useState(false)
  const [fee, setFee] = useState(false)

  const fetchActiveLoans = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.myLoan,
      })

      if (response.data.success) {
        setActive(response.data.data)
      } else {
        toast.error(response.data.message || "No active loan")
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveLoans()
  }, [])

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(num || 0)

  const getStatusColor = (status) => {
    switch (status) {
      case "awaiting_fee": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "pending_approval": return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "approved": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "disbursed": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "rejected": return "bg-red-500/10 text-red-400 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-4 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">My Loan Dashboard</h2>
          <p className="text-xs text-gray-400">Overview of your active loan</p>
        </div>

        <Link
          to="/clientStats/apply"
          className="bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 text-xs px-5 py-2 rounded-xl shadow-md"
        >
          Apply Loan
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <MyLoanSkeleton />
      ) : !active ? (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center text-gray-400 text-sm">
          No active loan found
        </div>
      ) : (
        <div className="space-y-5">

          {/* TOP CARD */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-5 rounded-2xl shadow-lg flex items-center gap-4">
            <MdAttachMoney size={45} />
            <div>
              <p className="text-xs opacity-80">Total Repayment</p>
              <p className="text-2xl font-bold">
                {formatCurrency(active.totalRepayment)}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <p className="text-xs text-gray-400">Amount Paid</p>
              <p className="text-lg font-semibold text-blue-400">
                {formatCurrency(active.amountPaid)}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-lg font-semibold text-red-400">
                {formatCurrency(active.balance)}
              </p>
            </div>

          </div>

          {/* DETAILS CARD */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-400">Loan Amount</span>
              <span>{formatCurrency(active.amount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(active.status)}`}>
                {active.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Duration</span>
              <span>{active.durationWeeks} Weeks</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Due Date</span>
              <span>
                {active.dueDate
                  ? new Date(active.dueDate).toDateString()
                  : "Not set"}
              </span>
            </div>

          </div>

          {/* FEE SECTION */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-400">Processing Fee</span>
              <span className={active.isFeePaid ? "text-green-400" : "text-red-400"}>
                {active.isFeePaid ? "Paid" : "Not Paid"}
              </span>
            </div>

            {!active.isFeePaid && (
              <button
                onClick={() => setFee(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-sm transition"
              >
                Pay Fee ({formatCurrency(active.processingFee)})
              </button>
            )}

            <div className="flex justify-between">
              <span className="text-gray-400">Fee Status</span>
              <span className="capitalize">{active.feeStatus}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Disbursed</span>
              <span>{active.isDisbursed ? "Yes" : "No"}</span>
            </div>

          </div>

          {/* CTA */}
          {active.isDisbursed && active.balance > 0 && (
            <button
              onClick={() => setRepay(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 py-3 rounded-xl font-medium shadow-md"
            >
              Pay Loan ({formatCurrency(active.balance)})
            </button>
          )}

        </div>
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
  )
}

export default MyLoan