import React, { useState } from 'react';

function ApplyLoan() {
  const[itemCount,setItemCount]=useState(4)
  const[itemId,setItemId]=useState()
  
  const increment = () => {
    if (itemCount >= 24) return
    const value = itemCount + 1
    setItemCount(value)
    setData(prev => ({ ...prev, durationWeeks: value }))
  }
  
  const decrement = () => {
    if (itemCount <= 4) return
    const value = itemCount - 1
    setItemCount(value)
    setData(prev => ({ ...prev, durationWeeks: value }))
  }
  return (
    <section className='flex items-center justify-center  bg-gray-100 rounded-lg p-2'>
      <div className='bg-white w-full max-w-4xl md:max-w-5xl lg:max-w-7xl p-6 rounded-2xl  flex flex-col items-center justify-center space-y-6'>
        <p className='text-lg md:text-xl lg:text-2xl font-medium text-center my-10'>Apply</p>
        <input
          type="number"
          className='w-full text-center text-5xl md:text-4xl lg:text-5xl py-4 px-7 rounded-lg outline-none '
          placeholder='0.00'
        />
                        <div className='grid items-center justify-between '>
                    <label htmlFor="" className='flex items-center text-sm gap-1 text-gray-600'>Duration <p className='italic'>(weeks)</p></label>
                    <div className='flex items-center lg:text-sm text-xs bg-gray-100 px-4 gap-4 py-2 rounded-lg'>
                     <button onClick={decrement} className='text-gray-500 cursor-pointer text-xl'>
                        &minus;
                    </button>

                    <span className='text-gray-700 flex items-center justify-center  font-semibold'>
                        
                        <input 
                        type="number" 
                        value={itemCount}
                        name='durationWeeks'
                         id='durationWeeks' 
                         
                        readOnly
                        className="w-12 bg-transparent text-center outline-none"
                        />
                        
                    </span>

                    <button onClick={increment} className='text-gray-500 cursor-pointer text-xl'>
                        &#43;
                    </button>

                    </div>
                  
                </div>
                


                <div className='my-8 flex items-center justify-center '>
                  <button className='p-2 bg-green-500 text-white w-50 rounded-lg '>Apply</button>
                </div>
                <p className='my-2 text-xs text-gray-500 italic'>Redirected to home page to pay the processing fee.</p>
      </div>
    </section>
  );
}

export default ApplyLoan;