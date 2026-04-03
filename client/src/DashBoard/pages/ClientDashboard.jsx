import React from 'react'
import { FaRegClock } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { MdAttachMoney } from 'react-icons/md';
import { TbMoneybag } from "react-icons/tb";

function ClientDashboard() {
  return (
   <section className='flex items-center justify-center p-1 bg-gray-100'>
    <div className='w-full grid bg-gray-50 p-2 max-w-4xl lg:max-w-7xl lg:w-full md:max-w-5xl md:w-full rounded '>
        <p className='text-gray-900 my-1 font-semibold text-md md:text-sm lg:text-lg '>Home</p>
        <p className='text-gray-900 mb-2 text-sm md:text-sm lg:text-lg '>Overview</p>
        
        <div className='items-center justify-between gap-2 my-2'>
            <div className='bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 my-2 p-2  rounded-xl shadow-md border border-gray-100'>
                
                <div className='flex items-center gap-2'>
                    <MdAttachMoney size={40} className='text-gray-600' />

                    <div className='grid'>
                        <p className='text-gray-700 my-2 font-semibold text-md md;text-sm lg:text-lg'>Loan Limit</p>
                        <span className='text-gray-700 my-2 font-bold text-lg md;text-sm lg:text-lg'>Ksh. 5,000 - Ksh. 95,000</span>
                    </div>
                    

                </div>

            </div>
            <div className='grid grid-cols-2 items-center justify-between gap-2'>
                
                <div className='flex items-center gap-2 bg-gradient-to-r border border-gray-300 from-green-400 via-green-400 to-green-500 p-2 rounded-xl'>
                    <GiSandsOfTime size={30} className='text-gray-600' />

                    <div className='grid'>
                        <p className='text-white my-2 font-semibold text-sm md;text-sm lg:text-lg'>Repayment Period</p>
                        <span className='text-white my-2 font-bold text-xs md;text-sm lg:text-lg'>4 - 24 Weeks</span>
                    </div>
                    

                </div>
                <div className='flex items-center gap-2 bg-gradient-to-r border border-gray-300 from-gray-200 via-gray-300 to-gray-400 p-2 rounded-xl'>
                    <FaRegClock size={30} className='text-gray-600' />

                    <div className='grid'>
                        <p className='text-gray-700 my-2 font-semibold text-sm md;text-sm lg:text-lg'>Processing Time</p>
                        <span className='text-gray-700 my-2 font-bold text-xs md;text-sm lg:text-lg'> Within 24 Hours </span>
                    </div>
                    

                </div>

            </div>


        </div>
        <div className='my-4 flex justify-center items-center'>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
            Apply Loan
            </button>

        </div>

        

    </div>
   </section>
  )
}

export default ClientDashboard