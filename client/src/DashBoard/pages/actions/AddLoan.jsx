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

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target

    // PHONE (strict 10 digits)
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10)
      setData(prev => ({ ...prev, phone: cleaned }))
      return
    }

    // AMOUNT (numbers only)
    if (name === "amount") {
      const cleaned = value.replace(/\D/g, "")
      setData(prev => ({ ...prev, amount: cleaned }))
      return
    }

    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ================= VALIDATION =================
  const isValidPhone = /^0\d{9}$/.test(data.phone)

  // ================= SUBMIT =================
  const applyLoanforCustomer = async (e) => {
    e.preventDefault()

    if (!isValidPhone) {
      return toast.error("Phone must be in 07XXXXXXXX format")
    }

    try {
      const payload = {
        ...data,
        phone: data.phone // backend will format using formatPhone.js
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

  // ================= DURATION CONTROL =================
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

          <button onClick={close} className='p-2 rounded-lg hover:bg-gray-800'>
            <IoClose className='text-white text-xl' />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={applyLoanforCustomer} className='p-6'>

          <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 text-xs'>

            {/* NAME */}
            <div>
              <label className='text-xs text-gray-400'>Name</label>
              <input
                name='name'
                value={data.name}
                onChange={handleChange}
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none'
              />
            </div>

            {/* PHONE */}
            <div>
              <label className='text-xs text-gray-400'>Phone (07XXXXXXXX)</label>

              <div className='flex items-center mt-1 bg-gray-800 rounded-xl overflow-hidden'>
                <span className='px-3 bg-gray-700 text-white'>+254</span>

                <input
                  name='phone'
                  value={data.phone}
                  onChange={handleChange}
                  placeholder='0712345678'
                  className='w-full p-3 bg-transparent text-white outline-none'
                />
              </div>

              {data.phone && !isValidPhone && (
                <p className='text-red-400 text-xs mt-1'>
                  Must start with 0 and be 10 digits
                </p>
              )}
            </div>

            {/* NATIONAL ID */}
            <div>
              <label className='text-xs text-gray-400'>National ID</label>
              <input
                name='nationalId'
                value={data.nationalId}
                onChange={handleChange}
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none'
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className='text-xs text-gray-400'>Amount</label>
              <input
                name='amount'
                value={data.amount}
                onChange={handleChange}
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none'
              />
            </div>

            {/* DURATION */}
            <div>
              <label className='text-xs text-gray-400'>Duration</label>

              <div className='mt-1 flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3'>
                <button type='button' onClick={decrement}>−</button>

                <input
                  value={data.durationWeeks}
                  readOnly
                  className='w-12 text-center bg-transparent text-white'
                />

                <button type='button' onClick={increment}>+</button>
              </div>
            </div>

            {/* MPESA */}
            <div>
              <label className='text-xs text-gray-400'>M-Pesa Code</label>
              <input
                name='mpesaCode'
                value={data.mpesaCode}
                onChange={handleChange}
                className='w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none'
              />
            </div>

          </div>

          {/* SUBMIT */}
          <button
            type='submit'
            disabled={!isValidPhone}
            className='w-full mt-6 bg-green-600 text-white py-3 rounded-xl disabled:opacity-50'
          >
            Add Loan
          </button>

        </form>

      </div>
    </section>
  )
}

export default AddLoan