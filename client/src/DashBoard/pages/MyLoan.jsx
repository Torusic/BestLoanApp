import React, { useEffect, useState } from 'react'
import SummaryApi from '../../common/SummaryApi'
import Axios from '../../utils/Axios'
import AxiosToastError from '../../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { MdAttachMoney } from 'react-icons/md'
import { Link } from 'react-router-dom'
import ProcessingFee from '../ProcessingFee'

const MyLoanSkeleton = () => {
  return (
    <div className='bg-gray-900 rounded-2xl p-4 animate-pulse space-y-3'>
      <div className='h-5 w-40 bg-gray-700 rounded'></div>
      <div className='h-20 bg-gray-700 rounded-xl'></div>
      <div className='grid grid-cols-2 gap-2'>
        <div className='h-16 bg-gray-700 rounded-xl'></div>
        <div className='h-16 bg-gray-700 rounded-xl'></div>
      </div>
      <div className='h-10 bg-gray-700 rounded-xl'></div>
    </div>
  )
}

function MyLoan() {

  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
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
      case "awaiting_fee": return "bg-yellow-500"
      case "pending_approval": return "bg-orange-500"
      case "approved": return "bg-green-500"
      case "disbursed": return "bg-blue-500"
      case "rejected": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-3">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">My Loan Dashboard</h2>

        <Link
          to="/clientStats/apply"
          className="bg-green-600 hover:bg-green-700 text-xs text-white px-5 py-2 rounded-xl"
        >
          Apply Loan
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <MyLoanSkeleton />
      ) : !active ? (
        <div className="bg-gray-900 text-gray-300 p-4 rounded-xl text-center text-sm">
          No active loan found
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl p-4 space-y-4 text-white">

          {/* TOP CARD */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-2xl flex items-center gap-3">
            <MdAttachMoney size={45} />
            <div>
              <p className="text-sm">Total Repayment</p>
              <p className="text-xl font-bold">
                {formatCurrency(active.totalRepayment)}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-3">

            <div className="bg-blue-600 p-3 rounded-xl">
              <p className="text-xs">Amount Paid</p>
              <p className="font-bold">{formatCurrency(active.amountPaid)}</p>
            </div>

            <div className="bg-red-600 p-3 rounded-xl">
              <p className="text-xs">Balance</p>
              <p className="font-bold">{formatCurrency(active.balance)}</p>
            </div>

          </div>

          {/* DETAILS */}
          <div className="bg-gray-800 p-3 rounded-xl space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Loan Amount</span>
              <span>{formatCurrency(active.amount)}</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(active.status)}`}>
                {active.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Duration</span>
              <span>{active.durationWeeks} Weeks</span>
            </div>

            <div className="flex justify-between">
              <span>Due Date</span>
              <span>
                {active.dueDate
                  ? new Date(active.dueDate).toDateString()
                  : "Not set"}
              </span>
            </div>

          </div>

          {/* FEE SECTION */}
          <div className="bg-gray-800 p-3 rounded-xl text-sm space-y-2">

            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span className={active.isFeePaid ? "text-green-400" : "text-red-400"}>
                {active.isFeePaid ? "Paid" : "Not Paid"}
              </span>
            </div>

            {!active.isFeePaid && (
              <button
                onClick={() => setFee(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm"
              >
                Pay Processing Fee ({formatCurrency(active.processingFee)})
              </button>
            )}

            <div className="flex justify-between">
              <span>Fee Status</span>
              <span className="capitalize">{active.feeStatus}</span>
            </div>

            <div className="flex justify-between">
              <span>Disbursed</span>
              <span>{active.isDisbursed ? "Yes" : "No"}</span>
            </div>

            <div className="flex justify-between">
              <span>Repayment Status</span>
              <span className="capitalize">{active.repaymentStatus}</span>
            </div>

          </div>

          {/* ACTION */}
          {active.isDisbursed && active.balance > 0 && (
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm">
              Pay Loan ({formatCurrency(active.balance)})
            </button>
          )}

        </div>
      )}

      {/* MODAL */}
      {fee && (
        <ProcessingFee
          loan={active}
          onClose={() => setFee(false)}
          refresh={fetchActiveLoans}
        />
      )}

    </section>
  )
}

export default MyLoan