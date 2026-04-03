import React from 'react'

function ActiveLoan() {
  return (
    <section className='flex '>
        <div className='w-full grid bg-gray-50  p-2 max-w-4xl lg:max-w-7xl lg:w-full md:max-w-5xl md:w-full rounded '>
           <p className='text-sm font-medium text-gray-500 my-2'> My Active loans</p>
           <div className='bg-white p-2 rounded '>
            <div className='bg-gray-100 p-2 rounded text-xs lg:text-sm md:text-sm grid gap-2'>
                <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Loan Amount: <span className='font-medium'> Ksh. 20,000</span></p>

                <div className='lg:flex grid items-center justify-between gap-2'>
                    <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Status: <span className='font-medium text-yellow-500'> Pending</span></p>
                    <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Repayment Status: <span className='font-medium'> 12 Weeks</span></p>
                     
                </div>
                <p className='flex  w-fit mr-auto items-center justify-center gap-2'>Due Date <span className='font-medium'> 15th August 2027</span></p>
                
            </div>
            <div className='p-2 grid items-center gap-2 mt-2'>

               <p className='flex   w-fit mr-auto text-xs lg:text-sm md:text-sm  items-center justify-center gap-2'>Processing Fee Paid: <span className='font-medium'> Ksh. 200</span></p>
               <div className='border-2 rounded w-full'></div>

               <span className='text-xs lg:text-sm md:text-sm'>Awaiting Approval</span>
            </div>

           

           </div>
        </div>
    </section>
  )
}

export default ActiveLoan