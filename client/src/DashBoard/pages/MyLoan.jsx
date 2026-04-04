import React, { useEffect, useState } from 'react'
import SummaryApi from '../../common/SummaryApi'
import Axios from '../../utils/Axios'
import AxiosToastError from '../../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { MdAttachMoney } from 'react-icons/md'
import { Link } from 'react-router-dom'

function MyLoan() {
  
  const [active, setActive] = useState([]) // ✅ FIX
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [fee, setFee] = useState(false)

  const fetchActiveLoans = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.myLoan,
      })

      if (response.data.success) {
        setActive(response.data.data || [])
      } else {
        toast.error(response.data.error)
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

  return (
    <section>
      <div className='w-full grid bg-gray-50 p-2 max-w-4xl lg:max-w-7xl md:max-w-5xl rounded-lg'>

        <div className='bg-white p-2 rounded-lg'>
          
          {/* Header */}
          <div className='flex items-center justify-between'>
            <p className='text-lg font-medium text-gray-500 my-2'>Loan</p>

            <button className="bg-green-500 hover:bg-green-600 text-xs text-white font-semibold py-2 px-6 rounded-2xl shadow-md">
              <Link to={"/clientStats/apply"}>Apply Loan</Link>
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className='text-center text-gray-500 text-sm'>Loading...</p>
          )}

          {/* No Loan */}
          {!loading && active.length === 0 && (
            <div className='text-gray-700 text-xs lg:text-sm flex justify-center'>
              No Loan
            </div>
          )}

          {/* Loans */}
          {active.map((data, index) => (
            <div key={index} className='my-4'>

              {/* Total Repayment */}
              <div className='shadow-md bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-2 rounded-xl'>
                <div className='flex items-center gap-2'>
                  <MdAttachMoney size={40} className='text-white' />
                  <div>
                    <p className='text-gray-100 font-semibold'>Total Repayment</p>
                    <span className='text-white font-bold text-xl'>
                      {formatCurrency(data.totalRepayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paid & Balance */}
              <div className='grid grid-cols-2 gap-2 mt-2'>

                <div className='bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-2 rounded-xl shadow-md'>
                  <p className='text-white text-sm'>Amount Repaid</p>
                  <span className='text-white font-bold text-lg'>
                    {formatCurrency(data.amountPaid)}
                  </span>
                </div>

                <div className='bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-2 rounded-xl shadow-md'>
                  <p className='text-white text-sm'>Balance</p>
                  <span className='text-white font-bold text-lg'>
                    {formatCurrency(data.balance)}
                  </span>
                </div>

              </div>

              {/* Details */}
              <div className='bg-gray-100 p-2 rounded-lg text-xs mt-2 grid gap-2'>

                <p>Loan Amount: <span className='font-medium'>{formatCurrency(data.amount)}</span></p>

                <div className='lg:flex grid justify-between'>
                  <p>Status:
                    <span className={`ml-1 font-medium ${
                      data.status === "pending" ? "text-yellow-500" :
                      data.status === "approved" ? "text-green-600" :
                      "text-red-500"
                    }`}>
                      {data.status}
                    </span>
                  </p>

                  <p>Repayment Period:
                    <span className='font-medium ml-1'>{data.durationWeeks} Weeks</span>
                  </p>
                </div>

                <p>Due Date:
                  <span className='font-medium ml-1'>
                    {data.dueDate ? new Date(data.dueDate).toDateString() : "Set at Approval"}
                  </span>
                </p>
              </div>

              {/* Fee Section */}
              <div className='p-2 grid gap-2 text-xs mt-2'>

                <p>Processing Fee:
                  <span className='font-medium ml-1'>
                    {data.isFeePaid ? "Paid" : "Not Paid"}
                  </span>
                </p>

                {data.processingFee && !data.isFeePaid && (
                  <button 
                    onClick={() => setFee(true)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    Pay Processing Fee ({formatCurrency(data.processingFee)})
                  </button>
                )}

              </div>

              {/* View More */}
              <button 
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 text-xs mt-2"
              >
                {showMore ? "View Less" : "View More"}
              </button>

              {showMore && (
                <div className="bg-gray-50 p-2 rounded mt-2 text-xs grid gap-2">
                  <p>Fee Status: <span className="font-medium">{data.feeStatus}</span></p>
                  <p>Payment Verified: <span>{data.paymentVerified ? "Yes" : "No"}</span></p>
                  <p>Repayment Status: <span>{data.repaymentStatus}</span></p>
                </div>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* Modal */}
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