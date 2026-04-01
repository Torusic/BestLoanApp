import React from 'react'
import { IoAdd } from 'react-icons/io5'

function Customers() {
  return (
    <section className='bg-gray-200'>
      <div className='bg-white p-2 max-w-md w-full '>
        <h2 className='text-lg font-bold text-gray-500 my-2'>Customers</h2>
        <div className='flex items-center  gap-1'>
           <span className='bg-gray-100 p-2 rounded-lg cursor-pointer'><IoAdd /></span>
          <p className='text-xs'>Add Customer</p>
         

        </div>

      </div>


    </section>
  )
}

export default Customers