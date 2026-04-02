import React from 'react'
import { IoClose } from 'react-icons/io5'

function Approve({close}) {
  return (
    <section className='bg-gray-900/70  p-12 fixed bottom-0 top-0 right-0 left-0 flex items-center  justify-center'>
        <div className='md:max-w-md bg-white md:w-full lg:max-w-lg lg:w-full max-w-sm w-full p-7 rounded-lg shadow-2xl'>

            <div className='flex items-center justify-between '>
                <p className='lgtext-sm text-xs font-semibold text-gray-700'>Loan Approval</p>
                <IoClose onClick={close}/>
            </div>
            <div className='my-5 grid items-center justify-between gap-2'>
                <p className='lg:text-sm text-sm font-normal text-gray-900'>
                    Are you Sure you want to approve ?
                 </p>

                 <p className='lg:text-sm text-xs italic font-semibold text-gray-900'>
                    (make sure mpesa code is valid)
                 </p>
            </div>

            <div className='w-fit ml-auto flex justify-between gap-2'>
                <button onClick={close} className='border-gray-900 border p-2 text-xs lg:text-sm cursor-pointer text-black font-semibold rounded'>
                    Cancel
                </button>

                 <button className='bg-gray-900 text-xs lg:text-sm cursor-pointer text-white font-semibold p-2 rounded'>
                    Approve
                </button>
            </div>

        </div>

    </section>
  )
}

export default Approve