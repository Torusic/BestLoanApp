import React, { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import AddCustomer from './actions/AddCustomer'

function Customers() {
  const[customer, setCustomer]=useState(false)
  return (
    <section className='bg-gray-200 '>
      <div className='bg-white p-2 max-w-md w-full lg:max-w-7xl lg:w-full '>
        <h2 className='text-lg font-bold text-gray-500 my-2'>Customers</h2>
        <div className='flex items-center  gap-1'>
           <span className='bg-gray-100 p-2 rounded-lg cursor-pointer'onClick={()=>setCustomer(true)}><IoAdd /></span>
          <p className='text-xs'>Add Customer</p>
         

        </div>

      </div>
      {
      customer && (
        <AddCustomer
        onClick={()=>setCustomer(false)}
        />
      )
    }


    </section>
    
  )
}

export default Customers