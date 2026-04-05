import React, { useEffect, useState } from 'react'
import SummaryApi from '../../common/SummaryApi'
import Axios from '../../utils/Axios'
import AxiosToastError from '../../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { GiSandsOfTime } from 'react-icons/gi'
import { MdAttachMoney } from 'react-icons/md'
import { FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { LuLoader } from 'react-icons/lu'
import ProcessingFee from '../ProcessingFee'

function MyLoan() {
  
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
 
              <div className='bg-green p-2 rounded-lg '>
                    <div className='flex items-center justify-between'>
                     <p className='text-lg font-medium text-gray-500 my-2'> Loan</p>
                     <div className='my-4 flex justify-center items-center w-fit ml-auto'>
                            <button className="bg-green-500 hover:bg-green-600 text-xs text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition-colors">
                            <Link to={"/clientStats/apply"}>Apply Loan</Link>
                    </button>
                    </div>
                    </div>
                                  {!active ?(
                   <div className='text-gray-700 flex font-semibold rounded-lg bg-gray-100 text-xs p-2 lg:text-sm font-normal  items-center justify-center'>
                    No Loan
                   </div>
   
               ):(
                   <div className='bg-green-50 p-1 rounded-xl'>
                               <div className='items-center justify-between gap-2 my-2'>
                                <div className='shadow-md bg-gradient-to-r from-green-400 via-green-500 to-green-600 my-2 p-2  rounded-xl shadow-md '>
                                    
                                    <div className='flex items-center gap-2'>
                                        <MdAttachMoney size={40} className='text-white' />
                    
                                        <div className='grid'>
                                            <p className='text-gray-100 my-2 font-semibold text-md md:text-sm lg:text-lg'>Total Repayment</p>
                                            <span className='text-gray-100 my-2 font-bold text-2xl md:text-sm lg:text-lg'> {formatCurrency(active.totalRepayment)}</span>
                                        </div>
                                        
                    
                                    </div>
                    
                                </div>
                                <div className='grid grid-cols-2 items-center justify-between gap-2'>
                                    
                                    <div className='flex items-center gap-2 shadow-md bg-gradient-to-r  from-blue-400 via-blue-500 to-blue-600 p-2 rounded-xl'>
                                    
                    
                                        <div className='grid px-4'>
                                            <p className='text-gray-100 my-2 font-semibold text-sm md;text-sm lg:text-lg'>Amount Repaid</p>
                                            <span className='text-gray-100 my-2 font-bold text-lg md;text-sm lg:text-lg'>{formatCurrency(active.amountPaid)}</span>
                                        </div>
                                        
                    
                                    </div>
                                    <div className='flex items-center gap-2 shadow-md bg-gradient-to-r  from-red-400 via-red-500 to-red-600 p-2 rounded-xl'>
                                        
                    
                                        <div className='grid px-4'>
                                            <p className='text-gray-100 my-2 font-semibold text-sm md;text-sm lg:text-lg'>Balance</p>
                                            <span className='text-gray-100 my-2 font-bold text-lg md:text-sm lg:text-lg'> {formatCurrency(active.balance)} </span>
                                        </div>
                                        
                    
                                    </div>
                    
                                </div>
                    
                    
                            </div>
                   <div className='bg-green-100 p-2 my-2 rounded-lg text-xs lg:text-sm md:text-sm grid gap-2'>
   
                   <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Loan Amount: <span className='font-medium'> {formatCurrency(active.amount)}</span></p>
   
                   <div className='lg:flex grid items-center justify-between gap-2'>
                       <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Status: <span  className={`font-normal ${active.status === "pending" ? "text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 py-1 px-2 rounded-xl" : active.status === "approved" ? "text-green-600 py-1 px-2 rounded-xl bg-gradient-to-r from-green-100 via-green-200 to-green-300" :"text-red-500"}`}> {active.status}</span></p>
                       <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Repayment Period: <span className='font-medium'> {active.durationWeeks} Weeks</span></p>
                        
                   </div>
                   <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Due Date <span className='font-medium'> {active.dueDate ? new Date(active.dueDate).toDateString()  : "Set at Approval"}</span></p>
                   
               </div>


                <div className=' grid'>

                <div className="bg-green-100 p-2 rounded mt-2 text-xs lg:text-sm md:text-sm grid gap-2">
                    
                    <p>Disbursed: 
                    <span className="font-medium"> {active.isDisbursed ? "Yes" : "No"}</span>
                    </p>

                    <p>Repayment Status: 
                    <span className="font-medium capitalize"> {active.repaymentStatus}</span>
                    </p>

                {active.isDisbursed && active.balance > 0 && (
                <button
                    onClick={() => setFee(true)} // later you can change to repayment modal
                    className="bg-blue-500 hover:bg-blue-600 text-sm text-white px-4 py-2 rounded-lg transition"
                >
                    Pay Loan ({formatCurrency(active.balance)})
                </button>
                )}

                </div>
             
                    
                   </div>


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

export default MyLoan