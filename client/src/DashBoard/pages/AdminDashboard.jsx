import React, { useEffect, useState } from 'react'
import { IoIosPersonAdd } from "react-icons/io"
import { FcApproval } from "react-icons/fc"
import { FaHistory } from 'react-icons/fa'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import { LuLoader } from "react-icons/lu"
import { IoAdd } from 'react-icons/io5'
import AddAgent from './actions/AddAgent'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [addAgent, setAddAgent] = useState(false)
  const navigate = useNavigate()

  const fetch = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getStats,
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setStats(response.data.data)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(num || 0)

  return (
    <section className="min-h-screen p-1 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-8">

      <div className="w-full">

        {!stats ? (
          <div className='flex items-center justify-center h-[50vh]'>
            <LuLoader className='animate-spin text-2xl text-gray-500' />
          </div>
        ) : (

          <div>

            <div className="mb-4">
              <h1 className="text-md lg:text-3xl font-semibold text-gray-800 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 lg:text-sm text-xs md:text-sm">
                Overview of system performance and loan activity
              </p>
            </div>

            <div className='bg-gradient-to-r from-indigo-500 to-indigo-600 text-white lg:p-6 p-5 rounded-2xl shadow-md hover:shadow-lg transition'>
              <p className="text-sm opacity-80 font-medium">Total Amount Issued</p>
              <h2 className="text-2xl font-bold mt-1">
                {formatCurrency(stats?.totalAmountIssued)}
              </h2>
            </div>

            <div className='grid grid-cols-2 gap-3 my-3'>

              <div className='bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition'>
                <p className="text-sm text-gray-500 font-medium">Total Amount Repaid</p>
                <h2 className="text-xl font-bold text-emerald-500 mt-1">
                  {formatCurrency(stats?.totalAmountRepaid)}
                </h2>
              </div>

              <div className='bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition'>
                <p className="text-sm text-gray-500 font-medium">Total Overdue Amount</p>
                <h2 className="text-xl font-bold text-rose-500 mt-1">
                  {formatCurrency(stats?.totalOverdueAmount)}
                </h2>
              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Clients</p>
                  <h2 className="text-xl font-bold text-gray-800 mt-1">
                    {stats?.totalClients}
                  </h2>
                </div>
                <IoIosPersonAdd className='text-emerald-500 text-2xl' />
              </div>

              <div className="bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition">
                <p className="text-sm text-gray-500">Total Agents</p>
                <h2 className="text-xl font-bold text-indigo-500 mt-1">
                  {stats?.totalAgents}
                </h2>
              </div>

              <div className="bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Loans Approved</p>
                  <h2 className="text-xl font-bold text-gray-800 mt-1">
                    {stats?.loansApproved}
                  </h2>
                </div>
                <FcApproval className='text-xl' />
              </div>

              <div className="bg-white/80 backdrop-blur-sm lg:p-6 p-5 rounded-2xl shadow-md border border-gray-200/50 hover:shadow-lg transition flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Loans Pending</p>
                  <h2 className="text-xl font-bold text-amber-500 mt-1">
                    {stats?.loansPending}
                  </h2>
                </div>
                <FaHistory className='text-amber-500 text-lg' />
              </div>

            </div>

            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-4 overflow-x-auto hover:shadow-lg transition">
              <div className='flex items-center justify-between my-2'>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Agent Performance
                </h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => navigate("/adminStats/allAgents")}
                    className='bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm'
                  >
                    View All
                  </button>
                  <button
                    onClick={() => setAddAgent(true)}
                    className='flex items-center gap-2 bg-gray-900 cursor-pointer text-white px-4 py-2 rounded-xl text-sm'
                  >
                    <IoAdd />
                    Add Agent
                  </button>
                </div>
              </div>

              <table className="min-w-full text-xs text-left">

                <thead className="bg-gray-50/70 text-gray-500 uppercase tracking-wide text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Agent Name</th>
                    <th className="px-4 py-3">Total Loans</th>
                    <th className="px-4 py-3">Amount Issued</th>
                  </tr>
                </thead>

                <tbody>

                  {stats?.agentStats?.length > 0 ? (
                    stats.agentStats.slice(0, 5).map((agent) => (
                      <tr
                        key={agent.agentId}
                        className="border-t border-gray-100/60 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-2 text-gray-700">{agent.name}</td>
                        <td className="px-4 py-2 text-gray-600">{agent.totalLoans}</td>
                        <td className="px-4 py-2 text-emerald-600 font-semibold">
                          {formatCurrency(agent.totalAmountIssued)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-400">
                        No agent data available
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

      {
        addAgent && (
          <AddAgent
            close={() => { setAddAgent(false) }}
            fetchDashboard={fetch}
          />
        )
      }

    </section>
  )
}

export default AdminDashboard