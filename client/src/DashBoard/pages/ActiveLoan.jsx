import React, { useEffect, useState } from 'react'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import ProcessingFee from '../ProcessingFee'

const ActiveLoanSkeleton = () => {
  return (
    <div className='bg-gray-900 p-2 rounded-lg text-white animate-pulse'>
      <div className='h-4 w-32 bg-gray-700 rounded mb-3'></div>

      <div className='bg-gray-800 p-2 rounded-lg grid gap-2'>
        <div className='h-4 w-48 bg-gray-700 rounded'></div>

        <div className='grid lg:flex gap-2 justify-between'>
          <div className='h-4 w-40 bg-gray-700 rounded'></div>
          <div className='h-4 w-40 bg-gray-700 rounded'></div>
        </div>

        <div className='h-4 w-56 bg-gray-700 rounded'></div>
      </div>

      <div className='p-2 grid gap-2 mt-2'>
        <div className='h-4 w-44 bg-gray-700 rounded'></div>
        <div className='h-8 w-56 bg-gray-700 rounded'></div>
        <div className='h-4 w-40 bg-gray-700 rounded'></div>
      </div>

      <div className='h-4 w-24 bg-gray-700 rounded mt-2'></div>
    </div>
  )
}

function ActiveLoan() {
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [fee, setFee] = useState(false)
 const fetchActiveLoans=async()=>{
   try { 
    setLoading(true) 
    const response=await Axios({ 
      ...SummaryApi.myLoan,
     }) 
     if(response.data.success){
       toast.success(response.data.message);
        setActive(response.data.data) 
      }else{ 
        toast.error(response.data.error)
       } } catch (error) {
         AxiosToastError(error)
         }finally{ 
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
      <div className='w-full grid bg-gray-800 text-white p-2 max-w-7xl rounded-lg'>
        <p className='text-sm font-medium text-gray-500 my-2'>My Active loans</p>

        <div className='bg-gray-700 p-2 rounded-lg'>

          {loading ? (
            <ActiveLoanSkeleton />
          ) : !active ? (
            <div className='text-gray-200 flex items-center justify-center py-6'>
              No active loan...
            </div>
          ) : (
            <div>
              <div className='bg-gray-900 p-2 rounded-lg text-white text-xs lg:text-sm grid gap-2'>
                <p className='flex gap-2'>
                  Loan Amount:
                  <span className='font-medium'>{formatCurrency(active.amount)}</span>
                </p>

                <div className='lg:flex grid justify-between gap-2'>
                  <p>
                    Status:
                    <span className='ml-2 font-semibold capitalize'>
                      {active.status}
                    </span>
                  </p>

                  <p>
                    Duration:
                    <span className='ml-2 font-medium'>
                      {active.durationWeeks} Weeks
                    </span>
                  </p>
                </div>

                <p>
                  Due Date:
                  <span className='ml-2 font-medium'>
                    {active.dueDate
                      ? new Date(active.dueDate).toDateString()
                      : 'Set at Approval'}
                  </span>
                </p>
              </div>

              <div className='p-2 grid gap-2 mt-2'>
                <p className='text-xs lg:text-sm'>
                  Processing Fee:
                  <span className={`ml-2 font-medium ${active.isFeePaid ? 'text-green-500' : 'text-red-500'}`}>
                    {active.isFeePaid ? 'Paid' : 'Not Paid'}
                  </span>
                </p>

                {!active.isFeePaid && (
                  <button
                    onClick={() => setFee(true)}
                    className='bg-blue-500 text-sm text-white px-4 py-2 rounded'
                  >
                    Pay Processing Fee ({formatCurrency(active.processingFee)})
                  </button>
                )}

                <p className='text-xs lg:text-sm'>
                  Fee Status:
                  <span className='ml-2 font-medium capitalize'>
                    {active.feeStatus}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowMore(!showMore)}
                className='text-blue-400 text-xs mt-2'
              >
                {showMore ? 'View Less' : 'View More'}
              </button>

              {showMore && (
                <div className='bg-gray-900 p-2 rounded mt-2 text-xs grid gap-2'>
                  <p>
                    Processing Fee:
                    <span className='ml-2 font-medium'>
                      {formatCurrency(active.processingFee)}
                    </span>
                  </p>

                  <p>
                    Fee Status:
                    <span className='ml-2 font-medium capitalize'>
                      {active.feeStatus}
                    </span>
                  </p>

                  <p>
                    Disbursed:
                    <span className='ml-2 font-medium'>
                      {active.isDisbursed ? 'Yes' : 'No'}
                    </span>
                  </p>

                  <p>
                    Total Repayment:
                    <span className='ml-2 font-medium'>
                      {formatCurrency(active.totalRepayment)}
                    </span>
                  </p>

                  <p>
                    Amount Paid:
                    <span className='ml-2 font-medium'>
                      {formatCurrency(active.amountPaid)}
                    </span>
                  </p>

                  <p>
                    Balance:
                    <span className='ml-2 font-medium'>
                      {formatCurrency(active.balance)}
                    </span>
                  </p>

                  <p>
                    Repayment Status:
                    <span className='ml-2 font-medium capitalize'>
                      {active.repaymentStatus}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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

export default ActiveLoan