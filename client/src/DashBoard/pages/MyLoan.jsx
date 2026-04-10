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
    <div className='bg-gray-800 rounded-lg p-2 animate-pulse'>

      <div className='h-6 w-32 bg-gray-700 rounded mb-3'></div>

      <div className='bg-gray-700 p-2 rounded-lg mb-3'>
        <div className='h-4 w-40 bg-gray-600 rounded mb-2'></div>
        <div className='h-6 w-56 bg-gray-600 rounded'></div>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-3'>
        <div className='h-16 bg-gray-700 rounded-xl'></div>
        <div className='h-16 bg-gray-700 rounded-xl'></div>
      </div>

      <div className='h-4 w-48 bg-gray-700 rounded mb-2'></div>
      <div className='h-4 w-36 bg-gray-700 rounded mb-2'></div>
      <div className='h-4 w-52 bg-gray-700 rounded mb-2'></div>

      <div className='h-10 w-full bg-gray-700 rounded mt-3'></div>
    </div>
  )
}

function MyLoan() {

  const[active, setActive]=useState(null) 
  const[loading, setLoading]=useState(false)
   const [showMore, setShowMore] = useState(false) 
   const[fee,setFee]=useState(false)
    const fetchActiveLoans=async()=>
      { try { 
        setLoading(true) 
        const response=await Axios({
           ...SummaryApi.myLoan,
           }) 
           if(response.data.success){ 
            toast.success(response.data.message);
             setActive(response.data.data)
             }else{
               toast.error(response.data.error)

              } 
            } catch (error)
             {
               AxiosToastError(error)
               }
               finally{
                
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
      <div className='w-full grid bg-gray-700 rounded-lg max-w-7xl'>

        <div className='bg-gray-900 p-2 rounded-lg'>

          <div className='flex items-center justify-between'>
            <p className='text-lg font-medium text-gray-400 my-2'>Loan</p>

            <Link
              to={"/clientStats/apply"}
              className="bg-green-500 hover:bg-green-600 text-xs text-white font-semibold py-2 px-6 rounded-2xl"
            >
              Apply Loan
            </Link>
          </div>

          {loading ? (
            <MyLoanSkeleton />
          ) : !active ? (
            <div className='text-gray-200 flex justify-center bg-gray-700 text-xs p-2 rounded'>
              No Loan
            </div>
          ) : (
            <div className='bg-gray-800 rounded-lg p-2'>

              <div className='grid gap-2'>

                <div className='bg-green-500 p-2 rounded-xl'>
                  <div className='flex items-center gap-2'>
                    <MdAttachMoney size={40} className='text-white' />
                    <div>
                      <p className='text-white font-semibold'>Total Repayment</p>
                      <p className='text-white font-bold'>
                        {formatCurrency(active.totalRepayment)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2'>

                  <div className='bg-blue-500 p-2 rounded-xl'>
                    <p className='text-white text-sm'>Amount Repaid</p>
                    <p className='text-white font-bold'>
                      {formatCurrency(active.amountPaid)}
                    </p>
                  </div>

                  <div className='bg-red-500 p-2 rounded-xl'>
                    <p className='text-white text-sm'>Balance</p>
                    <p className='text-white font-bold'>
                      {formatCurrency(active.balance)}
                    </p>
                  </div>

                </div>

              </div>

              <div className='bg-gray-900 text-white p-2 my-4 rounded-lg text-xs grid gap-2'>

                <p>
                  Loan Amount:
                  <span className='ml-2 font-medium'>
                    {formatCurrency(active.amount)}
                  </span>
                </p>

                <p>
                  Status:
                  <span className='ml-2 font-medium capitalize'>
                    {active.status}
                  </span>
                </p>

                <p>
                  Repayment Period:
                  <span className='ml-2 font-medium'>
                    {active.durationWeeks} Weeks
                  </span>
                </p>

                <p>
                  Due Date:
                  <span className='ml-2 font-medium'>
                    {active.dueDate
                      ? new Date(active.dueDate).toDateString()
                      : 'Set at Approval'}
                  </span>
                </p>

              </div>

              <div className='grid gap-2 text-white text-xs'>

                <p className='text-xs text-white'>
                  Processing Fee:
                  <span className={`ml-2 font-medium ${active.isFeePaid ? 'text-green-500' : 'text-red-500'}`}>
                    {active.isFeePaid ? 'Paid' : 'Not Paid'}
                  </span>
                </p>

                {!active.isFeePaid && (
                  <button
                    onClick={() => setFee(true)}
                    className='bg-blue-500 text-white px-4 py-2 rounded text-sm'
                  >
                    Pay Processing Fee ({formatCurrency(active.processingFee)})
                  </button>
                )}

                <p className='text-xs text-white'>
                  Repayment Status:
                  <span className='ml-2 capitalize'>
                    {active.repaymentStatus}
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
                    Repayment Status:
                    <span className='ml-2 font-medium capitalize'>
                      {active.repaymentStatus}
                    </span>
                  </p>
                

              </div>

              {active.isDisbursed && active.balance > 0 && (
                <button className='bg-blue-600 text-white px-4 py-2 mt-3 rounded text-sm'>
                  Pay Loan ({formatCurrency(active.balance)})
                </button>
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

export default MyLoan