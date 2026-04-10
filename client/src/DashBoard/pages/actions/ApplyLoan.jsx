import React, { useState, useEffect } from 'react'
import AxiosToastError from '../../../utils/AxiosToastError'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ApplyLoanSkeleton = () => {
  return (
    <div className="bg-gray-800 w-full max-w-lg md:max-w-5xl lg:max-w-7xl p-4 rounded-2xl animate-pulse space-y-6">

      <div className="h-6 w-40 bg-gray-700 rounded mx-auto"></div>

      <div className="h-16 w-full bg-gray-700 rounded-lg"></div>

      <div className="h-4 w-32 bg-gray-700 rounded mx-auto"></div>

      <div className="h-10 w-full bg-gray-700 rounded-lg"></div>

      <div className="h-2 w-full bg-gray-700 rounded-full"></div>

      <div className="h-20 w-full bg-gray-700 rounded-lg"></div>

      <div className="h-10 w-full bg-gray-700 rounded-lg"></div>

      <div className="space-y-2">
        <div className="h-3 w-3/4 bg-gray-700 rounded mx-auto"></div>
        <div className="h-3 w-2/3 bg-gray-700 rounded mx-auto"></div>
        <div className="h-3 w-1/2 bg-gray-700 rounded mx-auto"></div>
      </div>

    </div>
  )
}

function ApplyLoan() {

  const [apply, setApply] = useState({ amount: '', durationWeeks: 4 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const increment = () => {
    if (apply.durationWeeks >= 24) return
    setApply(prev => ({ ...prev, durationWeeks: prev.durationWeeks + 1 }))
  }

  const decrement = () => {
    if (apply.durationWeeks <= 4) return
    setApply(prev => ({ ...prev, durationWeeks: prev.durationWeeks - 1 }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setApply(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = async () => {
    if (!apply.amount || apply.amount <= 0) {
      setError('Please enter a valid loan amount.')
      return
    }

    setError('')

    try {
      const response = await Axios({
        ...SummaryApi.apply,
        data: apply
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setApply({ amount: '', durationWeeks: 4 })
        navigate('/clientStats/myLoan')
      } else {
        toast.error(response.data.message || 'Something went wrong.')
      }

    } catch (err) {
      AxiosToastError(err)
    }
  }

  const durationPercent = ((apply.durationWeeks - 4) / (24 - 4)) * 100

  return (
    <section className="flex items-center justify-center bg-gray-800 rounded-2xl p-4">

      {loading ? (
        <ApplyLoanSkeleton />
      ) : (

        <div className="bg-gray-800 w-full max-w-lg md:max-w-5xl lg:max-w-7xl p-4 text-white rounded-2xl flex flex-col items-center space-y-6">

          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-medium text-center">
            Enter Loan Amount
          </p>

          <input
            type="number"
            name="amount"
            value={apply.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full text-center text-4xl md:text-4xl lg:text-5xl py-4 px-6 rounded-lg outline-none text-white bg-gray-800"
          />

          {error && <p className="text-red-500 text-sm italic">{error}</p>}

          <div className="w-full flex flex-col items-center space-y-2">

            <label className="text-sm text-gray-400">Duration (weeks)</label>

            <div className="flex items-center bg-gray-900 px-4 gap-4 py-2 rounded-lg">

              <button onClick={decrement} className="text-xl">&minus;</button>

              <input
                type="number"
                value={apply.durationWeeks}
                readOnly
                className="w-12 text-center bg-transparent text-gray-400"
              />

              <button onClick={increment} className="text-xl">+</button>

            </div>

            <div className="w-full bg-gray-900 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${durationPercent}%` }}
              ></div>
            </div>

          </div>

          <div className="w-full bg-gray-900 p-4 rounded-lg text-center">
            You are applying for <span className="font-semibold">{apply.amount || 0}</span>
            {' '}for <span className="font-semibold">{apply.durationWeeks}</span> weeks.
          </div>

          <button
            onClick={handleApply}
            disabled={!apply.amount || apply.amount <= 0}
            className={`w-full py-2 rounded-lg font-medium ${
              !apply.amount || apply.amount <= 0
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-green-500'
            }`}
          >
            Apply
          </button>

        </div>

      )}

    </section>
  )
}

export default ApplyLoan