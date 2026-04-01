import React from 'react'
import { IoClose } from 'react-icons/io5'

function AddCustomer({close}) {
  return (
    
    <section className='bg-gray-950/50 fixed top-0 flex  items-center justify-center bottom-0 right-0 left-0 '>
         <div className='bg-white py-6 px-5 max-w-sm md:max-w-md w-full lg:max-w-3xl lg:w-full rounded mx-2 '>
            <div className='flex justify-between items-center'>
                <p className='text-xs font-semibold lg:text-sm my-2'>Add Tenant</p>
                <IoClose onClick={close} className='cursor-pointer'/>
            </div>
          

          <div className=' grid'>
            <div className='grid grid-cols-2 lg:grid-cols-3 items-center justify-between gap-2 text-xs'>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="">Name</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter customers name...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="">Phone</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter customers phone...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="">ID Number</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter customers national id...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="">Amount</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter customers  amount...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2 w-full'>
                    <label htmlFor="">Duration</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 rounded-lg w-full' placeholder='Enter customers duration...'/>
                </div>
                 <div className='flex items-center justify-center my-3 mt-6'>
                    <button className=' w-full cursor-pointer text-white font-semibold bg-green-400 p-3 rounded-lg '>
                        Add Customer
                    </button>

                </div>
                

            </div>

          </div>
        </div>

    </section>
  )
}

export default AddCustomer