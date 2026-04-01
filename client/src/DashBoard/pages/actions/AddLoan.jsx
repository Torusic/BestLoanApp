import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

function AddLoan({close}) {
    const[itemCount,setItemCount]=useState(4)
     const[itemId,setItemId]=useState()

    const increment=(id)=>{
        setItemId(id)
      if(itemCount>=24)return;
      setItemCount((preve)=>preve+1)
    }
    const decrement=(id)=>{
        setItemId(id)
      if(itemCount<=4) return;
      setItemCount((preve)=>preve-1)
    }
    
  return (
    
    <section className='bg-gray-950/50 fixed top-0 flex  items-center justify-center bottom-0 right-0 left-0 '>
         <div className='bg-white py-6 px-5 max-w-sm md:max-w-md w-full lg:max-w-3xl lg:w-full rounded mx-2 '>
            <div className='flex justify-between items-center'>
                <p className='text-xs font-semibold lg:text-sm my-2 text-gray-700'>Apply Loan for Customer</p>
                <IoClose onClick={close} className='cursor-pointer'/>
            </div>
          

          <div className=' grid'>
            <div className='grid grid-cols-2 lg:grid-cols-3 items-center justify-between gap-2 text-xs'>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Name</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  name...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Phone</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  phone...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>ID Number</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter national id...'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Amount</label>
                    <input type="text" className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  amount...'/>
                </div>
                <div className='grid items-center justify-between '>
                    <label htmlFor="" className='flex items-center gap-1 text-gray-600'>Duration <p className='italic'>(months)</p></label>
                    <div className='flex items-center lg:text-sm text-xs bg-gray-100 px-4 gap-4 py-2 rounded-lg'>
                     <button onClick={decrement} className='text-gray-500 cursor-pointer text-xl'>
                        &minus;
                    </button>

                    <span className='text-gray-700 flex items-center justify-center  font-semibold'>
                        
                        <input 
                        type="number" 
                        value={itemCount}
                        readOnly
                        className="w-12 bg-transparent text-center outline-none"
                        />
                        
                    </span>

                    <button onClick={increment} className='text-gray-500 cursor-pointer text-xl'>
                        &#43;
                    </button>

                    </div>
                    
                </div>
                 <div className='flex items-center justify-center my-3 mt-6'>
                    <button className=' w-full cursor-pointer text-white font-semibold bg-green-400 p-3 rounded-lg '>
                        Add Loan
                    </button>

                </div>
                

            </div>

          </div>
        </div>

    </section>
  )
}

export default AddLoan