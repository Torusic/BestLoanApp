import React, { useEffect, useState } from 'react'

import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import ProcessingFee from '../ProcessingFee'



function ActiveLoan() {
    const[active, setActive]=useState(null)
    const[loading, setLoading]=useState(false)
    const [showMore, setShowMore] = useState(false)
      const[fee,setFee]=useState(false)

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
            }

            
        } catch (error) {
            AxiosToastError(error)
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchActiveLoans()

    },[])

      const formatCurrency = (num) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(num || 0)
  return (
    <section className=''>
        <div className='w-full grid bg-gray-50  p-2 max-w-4xl lg:max-w-7xl lg:w-full md:max-w-5xl md:w-full rounded-lg '>
           <p className='text-sm font-medium text-gray-500 my-2'> My Active loans</p>
           <div className='bg-green-50 p-2 rounded-lg '>
                               {!active ?(
                <div className='text-gray-900 flex items-center justify-center'>
                    No active loan...
                </div>

            ):(
                <div>
                <div className='bg-gray-50 p-2 rounded-lg text-xs lg:text-sm md:text-sm grid gap-2'>

                <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Loan Amount: <span className='font-medium'> {formatCurrency(active.amount)}</span></p>

                <div className='lg:flex grid items-center justify-between gap-2'>
                    <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Status: <span className={`font-normal ${active.status === "pending" ? "text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 py-1 px-2 rounded-xl" : active.status === "approved" ? "text-green-600 py-1 px-2 rounded-xl bg-gradient-to-r from-green-100 via-green-200 to-green-300" :"text-red-500"}`}> {active.status}</span></p>
                    <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Repayment Status: <span className='font-medium'> {active.durationWeeks} Weeks</span></p>
                     
                </div>
                <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Due Date <span className='font-medium'> {active.dueDate ? new Date(active.dueDate).toDateString()  : "Set at Approval"}</span></p>
                
            </div>
            <div className='p-2 grid items-center gap-2 mt-2'>

               <p className='flex   w-fit mr-auto text-xs lg:text-sm md:text-sm  items-center justify-center gap-2'>Processing Fee: <span className='font-medium'> {active.isFeePaid ? "Paid" : "Not Paid"}</span></p>

               {!active.isFeePaid && (
                <button onClick={()=>setFee(true)} className="bg-blue-600 text-sm text-white px-4 py-2  rounded">
                     Pay Processing Fee: ({formatCurrency(active.processingFee)})
                </button>
                )}
               

               <p className='flex   w-fit mr-auto text-xs lg:text-sm md:text-sm  items-center justify-center gap-2'>Fee Status: <span className='font-medium'> {active.feeStatus}</span></p>
            </div>

            <button 
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 text-xs mt-2 w-fit"
                >
                {showMore ? "View Less" : "View More"}
                </button>


                {showMore && (
                <div className="bg-gray-50 p-2 rounded mt-2 text-xs lg:text-sm md:text-sm grid gap-2">
                    
                    <p>Processing Fee: <span className="font-medium">{formatCurrency(active.processingFee)}</span></p>

                    <p>Fee Status: 
                    <span className="font-medium capitalize"> {active.feeStatus}</span>
                    </p>

                    <p>Disbursed: 
                    <span className="font-medium"> {active.isDisbursed ? "Yes" : "No"}</span>
                    </p>

                    <p>Total Repayment: 
                    <span className="font-medium"> {formatCurrency(active.totalRepayment)}</span>
                    </p>

                    <p>Amount Paid: 
                    <span className="font-medium"> {formatCurrency(active.amountPaid)}</span>
                    </p>

                    <p>Balance: 
                    <span className="font-medium"> {formatCurrency(active.balance)}</span>
                    </p>

                    <p>Repayment Status: 
                    <span className="font-medium capitalize"> {active.repaymentStatus}</span>
                    </p>

                </div>
                )}
                </div>

                
                

            )

            }
         
            

           

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