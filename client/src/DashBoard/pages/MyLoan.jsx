import React, { useEffect, useState } from 'react'
import SummaryApi from '../../common/SummaryApi'
import Axios from '../../utils/Axios'
import AxiosToastError from '../../utils/AxiosToastError'
import {
  MdAttachMoney,
  MdCelebration,
  MdOutlinePendingActions,
  MdCheckCircle,
  MdError,
  MdAccessTime,
  MdTrendingUp
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import ProcessingFee from '../ProcessingFee'
import RepaymentModal from './RepaymentModal'

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
        setActive(null)
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
      case "awaiting_fee": return "text-yellow-400"
      case "pending_approval": return "text-orange-400"
      case "approved": return "text-green-400"
      case "disbursed": return "text-blue-400"
      case "rejected": return "text-red-400"
      case "repaid": return "text-emerald-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "awaiting_fee": return <MdOutlinePendingActions />
      case "pending_approval": return <MdAccessTime />
      case "approved": return <MdCheckCircle />
      case "disbursed": return <MdAttachMoney />
      case "rejected": return <MdError />
      case "repaid": return <MdCelebration />
      default: return <MdOutlinePendingActions />
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-4 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">My Loan Dashboard</h2>
          <p className="text-xs text-gray-400">Track your loan status</p>
        </div>

        <Link
          to="/clientStats/apply"
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-xs"
        >
          Apply Loan
        </Link>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-gray-900 p-6 rounded-2xl text-gray-400">
          Loading...
        </div>
      ) : !active ? (

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center text-gray-400">
          No active loan found

          <div className="mt-4">
            <Link
              to="/clientStats/apply"
              className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl text-white"
            >
              Apply for Loan
            </Link>
          </div>
        </div>

      ) : active.status === "repaid" ? (

        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center text-green-400">
          <MdCelebration size={35} className="mx-auto mb-2" />
          <p className="font-semibold">Congratulations 🎉</p>
          <p className="text-sm">You have fully repaid your loan.</p>
        </div>

      ) : active.status === "rejected" ? (

        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center text-red-400">
          <MdError size={35} className="mx-auto mb-2" />
          <p className="font-semibold">Loan Rejected</p>
        </div>

      ) : (

        <div className="space-y-5">

          {/* TOP CARD */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-5 rounded-2xl flex items-center gap-4">
            <MdAttachMoney size={45} />
            <div>
              <p className="text-xs opacity-80">Total Repayment</p>
              <p className="text-2xl font-bold">
                {formatCurrency(active.totalRepayment)}
              </p>
            </div>
          </div>

          {/* 🔥 INTEREST CARD (NEW) */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MdTrendingUp className="text-yellow-400" />
              Interest Charged
            </div>
            <span className="text-yellow-400 font-semibold">
              {formatCurrency(active.interestAmount)}
            </span>
          </div>

          {/* STATUS */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-gray-400 text-sm">Status</span>
            <span className={`flex items-center gap-1 ${getStatusColor(active.status)}`}>
              {getStatusIcon(active.status)}
              <span className="capitalize">{active.status}</span>
            </span>
          </div>

          {/* PROCESSING FEE */}
          {active.status === "awaiting_fee" && !active.isFeePaid && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl space-y-2">
              <p className="text-sm">Processing Fee: {formatCurrency(active.processingFee)}</p>
              <p className="text-sm">Paybill: {active.paybillNumber}</p>
              <p className="text-sm">Account: {active.accountNumber}</p>

              <button
                onClick={() => setFee(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-xl"
              >
                Pay Processing Fee
              </button>
            </div>
          )}

          {/* AMOUNT + BALANCE */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <p className="text-xs text-gray-400">Amount Paid</p>
              <p className="text-lg text-blue-400 font-semibold">
                {formatCurrency(active.amountPaid)}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-lg text-red-400 font-semibold">
                {formatCurrency(active.balance)}
              </p>
            </div>

          </div>

          {/* DETAILS */}
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-sm space-y-2">

            <div className="flex justify-between">
              <span className="text-gray-400">Loan Amount</span>
              <span>{formatCurrency(active.amount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Interest</span>
              <span className="text-yellow-400">
                {formatCurrency(active.interestAmount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Total Repayment</span>
              <span className="text-green-400">
                {formatCurrency(active.totalRepayment)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Duration</span>
              <span>{active.durationWeeks} weeks</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Due Date</span>
              <span>
                {active.dueDate ? new Date(active.dueDate).toDateString() : "Not set"}
              </span>
            </div>

          </div>

          {/* REPAY BUTTON */}
          {active.isDisbursed && active.balance > 0 && (
            <button
              onClick={() => setRepay(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl"
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