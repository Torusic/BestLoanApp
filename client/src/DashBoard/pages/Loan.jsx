import React, { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import AddLoan from './actions/AddLoan'


function Loan() {
  const[customer, setCustomer]=useState(false)
  return (
    <section className='bg-gray-200 '>
      <div className='bg-white p-2 max-w-md w-full lg:max-w-7xl lg:w-full '>
        <h2 className='text-lg font-bold text-gray-500 my-2'>Loans</h2>
        <div className='flex items-center  gap-1'>
           <span className='bg-gray-100 p-2 rounded-lg cursor-pointer'onClick={()=>setCustomer(true)}><IoAdd /></span>
          <p className='text-xs lg:text-lg md:text-sm font-semibold text-gray-700'>Apply Loan for Customer</p>
         

        </div>

      </div>
      {
      customer && (
        <AddLoan
        close={()=>setCustomer(false)}
        />
      )
    }


    </section>
    
  )
}

export default Loan