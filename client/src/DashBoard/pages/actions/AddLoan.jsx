import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../../../utils/AxiosToastError'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import Axios from '../../../utils/Axios'
import { useNavigate } from 'react-router-dom'

function AddLoan({ close, fetch }) {
  const navigate = useNavigate()

  const [data, setData] = useState({
    name: "",
    phone: "",
    nationalId: "",
    amount: "",
    durationWeeks: 4,
    mpesaCode: ""
  })

  const applyLoanforCustomer = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.applyLoanViaAdmin,
        data: data
      })

      if (response.data.success) {
        toast.success(response.data.message)

        setData({
          name: "",
          phone: "",
          nationalId: "",
          amount: "",
          durationWeeks: 4,
          mpesaCode: ""
        })

        fetch()
        close()
        navigate("/adminStats/loans")
      } else {
        toast.error(response.data.error)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const increment = () => {
    if (data.durationWeeks >= 24) return
    setData(prev => ({
      ...prev,
      durationWeeks: prev.durationWeeks + 1
    }))
  }

  const decrement = () => {
    if (data.durationWeeks <= 4) return
    setData(prev => ({
      ...prev,
      durationWeeks: prev.durationWeeks - 1
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

      <div className='w-full max-w-4xl mx-3 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl'>

        {/* Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-800'>
          <div>
            <h2 className='text-white text-sm font-semibold'>Apply Loan</h2>
            <p className='text-xs text-gray-400'>Register loan for customer</p>
          </div>

          <button
            onClick={close}
            className='p-2 rounded-lg hover:bg-gray-800 transition'
          >
            <IoClose className='text-white text-xl' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={applyLoanforCustomer} className='p-6'>

          <div className='grid grid-cols-2 md:grid-cols-2 text-xs lg:grid-cols-3 gap-4'>

            {/* Name */}
            <div>
              <label className='text-xs text-gray-400'>Name</label>
              <input
                name='name'
                value={data.name}
                onChange={handleChange}
                placeholder='Enter name'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Phone */}
            <div>
              <label className='text-xs text-gray-400'>Phone</label>
              <input
                name='phone'
                value={data.phone}
                onChange={handleChange}
                placeholder='Enter phone'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* National ID */}
            <div>
              <label className='text-xs text-gray-400'>National ID</label>
              <input
                name='nationalId'
                value={data.nationalId}
                onChange={handleChange}
                placeholder='Enter ID number'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Amount */}
            <div>
              <label className='text-xs text-gray-400'>Amount</label>
              <input
                name='amount'
                value={data.amount}
                onChange={handleChange}
                placeholder='Enter amount'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Duration */}
            <div>
              <label className='text-xs text-gray-400 flex items-center gap-1'>
                Duration <span className='text-[10px]'>(weeks)</span>
              </label>

              <div className='mt-1 flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3'>

                <button
                  type='button'
                  onClick={decrement}
                  className='text-white text-xl hover:text-red-400'
                >
                  −
                </button>

                <input
                  type='number'
                  name='durationWeeks'
                  value={data.durationWeeks}
                  readOnly
                  className='w-12 text-center bg-transparent text-white outline-none'
                />

                <button
                  type='button'
                  onClick={increment}
                  className='text-white text-xl hover:text-green-400'
                >
                  +
                </button>

              </div>
            </div>

            {/* Mpesa Code */}
            <div>
              <label className='text-xs text-gray-400 flex items-center gap-1'>
                M-Pesa Code <span className='text-[10px]'>(after payment)</span>
              </label>

              <input
                name='mpesaCode'
                value={data.mpesaCode}
                onChange={handleChange}
                placeholder='Enter payment code'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type='submit'
            className='w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transition'
          >
            Add Loan
          </button>

        </form>

      </div>

    </section>
  )
}

export default AddLoan