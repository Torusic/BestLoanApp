import React, { useEffect, useState } from 'react'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'
import { LuLoader } from "react-icons/lu"

const ViewAllTenants = () => {

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAgents = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getAllAgents
      })

      if (response.data.success) {
        setAgents(response.data.data.agents || [])
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <LuLoader className="animate-spin text-3xl text-gray-400" />
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-950 p-4 lg:p-8 text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          All Agents
        </h1>
        <p className="text-gray-400 text-sm">
          List of all registered agents in the system
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="text-left py-3">Name</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Email</th>
              <th className="text-left">National ID</th>
              <th className="text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <tr key={agent._id} className="border-b border-gray-800">
                  <td className="py-3">{agent.name}</td>
                  <td>{agent.phone}</td>
                  <td>{agent.email}</td>
                  <td>{agent.nationalId}</td>
                  <td>
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </section>
  )
}

export default ViewAllTenants