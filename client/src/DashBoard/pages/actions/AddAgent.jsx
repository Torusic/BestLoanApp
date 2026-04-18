import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../../../utils/AxiosToastError'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function AddAgent({ close, fetchDashboard }) {
  const navigate = useNavigate()

  const [agent, setAgent] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: ""
  })

  const handleAddAgent = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.addAgent,
        data: agent
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setAgent({
          name: "",
          email: "",
          phone: "",
          nationalId: ""
        })
        fetchDashboard()
        close()
        navigate("/adminStats/adminDashboard")
      } else {
        toast.error(response.data.error)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setAgent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

      <div className='w-full max-w-lg mx-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl'>

        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-800'>
          <div>
            <h2 className='text-sm font-semibold text-white'>Add New Agent</h2>
            <p className='text-xs text-gray-400'>Register a new loan agent</p>
          </div>

          <button
            onClick={close}
            className='p-2 rounded-lg hover:bg-gray-800 transition'
          >
            <IoClose className='text-white text-xl' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddAgent} className='p-5 space-y-4'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            {/* Name */}
            <div>
              <label className='text-xs text-gray-400'>Full Name</label>
              <input
                type="text"
                name='name'
                value={agent.name}
                onChange={handleChange}
                placeholder='Enter full name'
                className='w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Email */}
            <div>
              <label className='text-xs text-gray-400'>Email</label>
              <input
                type="text"
                name='email'
                value={agent.email}
                onChange={handleChange}
                placeholder='Enter email'
                className='w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Phone */}
            <div>
              <label className='text-xs text-gray-400'>Phone</label>
              <input
                type="text"
                name='phone'
                value={agent.phone}
                onChange={handleChange}
                placeholder='Enter phone'
                className='w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* National ID */}
            <div>
              <label className='text-xs text-gray-400'>National ID</label>
              <input
                type="number"
                name='nationalId'
                value={agent.nationalId}
                onChange={handleChange}
                placeholder='Enter ID number'
                className='w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type='submit'
            className='w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 rounded-xl transition shadow-lg'
          >
            Add Agent
          </button>

        </form>
      </div>

    </section>
  )
}

export default AddAgent