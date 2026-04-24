import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../../../utils/AxiosToastError'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import Axios from '../../../utils/Axios'
import { useNavigate } from 'react-router-dom'

// 🔥 phone formatter
const formatPhone = (phone) => {
  if (!phone) return "";

  phone = phone.replace(/\D/g, "");

  if (phone.startsWith("254")) return "+" + phone;
  if (phone.startsWith("0")) return "+254" + phone.slice(1);
  if (phone.length === 9) return "+254" + phone;

  return phone;
};

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

  // ✅ INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ LOAN SUBMIT
  const applyLoanforCustomer = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...data,
        phone: formatPhone(data.phone), // 🔥 IMPORTANT FIX
      }

      const response = await Axios({
        ...SummaryApi.applyLoanViaAdmin,
        data: payload
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
        toast.error(response.data.message || "Failed")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  // ✅ DURATION CONTROL
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

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

      <div className='w-full max-w-4xl mx-3 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl'>

        {/* HEADER */}
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

        {/* FORM */}
        <form onSubmit={applyLoanforCustomer} className='p-6'>

          <div className='grid grid-cols-2 md:grid-cols-2 text-xs lg:grid-cols-3 gap-4'>

            {/* NAME */}
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

            {/* PHONE (FIXED +254) */}
            <div>
              <label className='text-xs text-gray-400'>Phone</label>

              <div className='flex items-center mt-1 bg-gray-800 rounded-xl overflow-hidden'>
                <span className='px-3 bg-gray-700 text-white'>+254</span>

                <input
                  name='phone'
                  value={data.phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 9)
                    setData(prev => ({ ...prev, phone: cleaned }))
                  }}
                  placeholder='712345678'
                  className='w-full p-3 bg-transparent text-white outline-none'
                />
              </div>
            </div>

            {/* NATIONAL ID */}
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

            {/* AMOUNT */}
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

            {/* DURATION */}
            <div>
              <label className='text-xs text-gray-400'>Duration (weeks)</label>

              <div className='mt-1 flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3'>

                <button type='button' onClick={decrement} className='text-white text-xl'>
                  −
                </button>

                <input
                  value={data.durationWeeks}
                  readOnly
                  className='w-12 text-center bg-transparent text-white outline-none'
                />

                <button type='button' onClick={increment} className='text-white text-xl'>
                  +
                </button>

              </div>
            </div>

            {/* MPESA */}
            <div>
              <label className='text-xs text-gray-400'>M-Pesa Code</label>
              <input
                name='mpesaCode'
                value={data.mpesaCode}
                onChange={handleChange}
                placeholder='Enter payment code'
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

          </div>

          {/* SUBMIT */}
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