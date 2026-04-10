import React, { useEffect, useState } from 'react'
import { FaRegClock } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { MdAttachMoney } from 'react-icons/md';
import { Link } from 'react-router-dom';
import ActiveLoan from './ActiveLoan'


const SkeletonBox = () => (
  <div className="animate-pulse bg-gray-800 rounded-xl p-4">
    <div className="h-5 w-32 bg-gray-700 rounded mb-3"></div>
    <div className="h-4 w-48 bg-gray-700 rounded"></div>
  </div>
);

const SkeletonActiveLoan = () => (
  <div className="animate-pulse bg-gray-800 rounded-xl p-4 mt-2">
    <div className="h-5 w-40 bg-gray-700 rounded mb-3"></div>
    <div className="h-3 w-full bg-gray-700 rounded mb-2"></div>
    <div className="h-3 w-3/4 bg-gray-700 rounded"></div>
  </div>
);

function ClientDashboard() {
  const [loading, setLoading] = useState(true);
 

  

  return (
    <section className='flex items-center justify-center p-1'>
      <div className='w-full grid bg-gray-900 p-2 max-w-4xl lg:max-w-7xl lg:w-full md:max-w-5xl rounded'>

        <div className='flex items-center justify-between'>
          <div>
            <p className='text-white my-1 font-semibold text-md md:text-sm lg:text-lg'>Home</p>
            <p className='text-white mb-1 text-sm md:text-sm lg:text-lg'>Overview</p>
          </div>

          <div className='my-4 flex justify-center items-center'>
            <button className="bg-green-500 hover:bg-green-600 text-xs text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition-colors">
              <Link to={"/clientStats/apply"}>Apply Loan</Link>
            </button>
          </div>
        </div>

        <div className='items-center justify-between gap-2 my-2'>

         
            <div className='shadow-md bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 my-2 p-2 rounded-xl'>
              <div className='flex items-center gap-2'>
                <MdAttachMoney size={40} className='text-gray-100' />
                <div>
                  <p className='text-gray-100 my-2 font-semibold text-md'>
                    Loan Limit
                  </p>
                  <span className='text-gray-100 font-bold text-lg'>
                    Ksh. 5,000 - Ksh. 95,000
                  </span>
                </div>
              </div>
            </div>
    
          <div className='grid grid-cols-2 items-center justify-between gap-2'>

         
              <>
                <div className='flex items-center gap-2 shadow-md bg-gradient-to-r from-green-400 via-green-400 to-green-500 p-2 rounded-xl'>
                  <GiSandsOfTime size={30} className='text-gray-100' />
                  <div>
                    <p className='text-gray-100 my-2 font-semibold text-sm'>
                      Repayment Period
                    </p>
                    <span className='text-gray-100 font-bold text-xs'>
                      4 - 24 Weeks
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2 shadow-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 p-2 rounded-xl'>
                  <FaRegClock size={30} className='text-gray-600' />
                  <div>
                    <p className='text-gray-700 my-2 font-semibold text-sm'>
                      Processing Time
                    </p>
                    <span className='text-gray-700 font-bold text-xs'>
                     24 Hours
                    </span>
                  </div>
                </div>
              </>
         

          </div>
        </div>

        <div className='mt-1'>
          <ActiveLoan/>
        </div>

      </div>
    </section>
  );
}

export default ClientDashboard;