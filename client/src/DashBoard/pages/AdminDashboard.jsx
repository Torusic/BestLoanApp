import React, { useEffect, useState } from 'react'
import { IoIosPersonAdd } from "react-icons/io"
import { FcApproval } from "react-icons/fc"
import { FaHistory } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'
import { LuLoader } from "react-icons/lu"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'

import AddAgent from './actions/AddAgent'

const AdminDashboard = () => {

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addAgent, setAddAgent] = useState(false)

  const navigate = useNavigate()

  const fetchStats = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getStats,
      })

      if (response.data.success) {
        setStats(response.data.data)
      } else {
        toast.error(response.data.message || "Failed to load stats")
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(num || 0)

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <LuLoader className="animate-spin text-3xl text-gray-400" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-400">
        No dashboard data available
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-950 p-3 lg:p-8 text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-sm">
          Overview of system performance and loan activity
        </p>
      </div>

      {/* MAIN STATS */}
      <div className="grid gap-4 lg:grid-cols-3">

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 rounded-2xl">
          <p className="text-sm opacity-80">Total Amount Issued</p>
          <h2 className="text-2xl font-bold mt-2">
            {formatCurrency(stats.totalAmountIssued)}
          </h2>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <p className="text-sm text-gray-400">Total Amount Repaid</p>
          <h2 className="text-2xl font-bold text-emerald-500 mt-2">
            {formatCurrency(stats.totalAmountRepaid)}
          </h2>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <p className="text-sm text-gray-400">Total Overdue</p>
          <h2 className="text-2xl font-bold text-red-500 mt-2">
            {formatCurrency(stats.totalOverdueAmount)}
          </h2>
        </div>

      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

        <div className="bg-gray-900 p-4 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Clients</p>
            <h2 className="text-xl font-bold">{stats.totalClients}</h2>
          </div>
          <IoIosPersonAdd className="text-green-400 text-2xl" />
        </div>

        <div className="bg-gray-900 p-4 rounded-2xl">
          <p className="text-sm text-gray-400">Agents</p>
          <h2 className="text-xl font-bold text-indigo-400">
            {stats.totalAgents}
          </h2>
        </div>

        <div className="bg-gray-900 p-4 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Disbursed</p>
            <h2 className="text-xl font-bold">{stats.loansDisbursed}</h2>
          </div>
          <FcApproval className="text-xl" />
        </div>

        <div className="bg-gray-900 p-4 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Pending</p>
            <h2 className="text-xl font-bold text-yellow-400">
              {stats.loansPending}
            </h2>
          </div>
          <FaHistory className="text-yellow-400" />
        </div>

      </div>

      {/* AGENTS TABLE */}
      <div className="mt-8 bg-gray-900 rounded-2xl border border-gray-800 p-4">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Agent Performance</h3>

          <button
            onClick={() => setAddAgent(true)}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl text-sm"
          >
            <IoAdd />
            Add Agent
          </button>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-2">Agent</th>
                <th>Total Loans</th>
                <th>Amount Issued</th>
              </tr>
            </thead>

            <tbody>

              {stats?.agentStats?.length ? (
                stats.agentStats.slice(0, 5).map((agent) => (
                  <tr key={agent.agentId} className="border-b border-gray-800">
                    <td className="py-3">{agent.name}</td>
                    <td className="text-center">{agent.totalLoans}</td>
                    <td className="text-green-400 font-semibold text-center">
                      {formatCurrency(agent.totalAmountIssued)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No agent data found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/adminStats/allAgents")}
            className="bg-white text-black px-4 py-2 rounded-xl text-sm"
          >
            View All Agents
          </button>
        </div>

      </div>

      {/* MODAL */}
      {addAgent && (
        <AddAgent
          close={() => setAddAgent(false)}
          fetchDashboard={fetchStats}
        />
      )}

    </section>
  )
}

export default AdminDashboard