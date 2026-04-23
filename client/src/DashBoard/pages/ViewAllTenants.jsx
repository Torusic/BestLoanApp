import React, { useEffect, useState } from 'react'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'
import { LuLoader } from "react-icons/lu"

const ViewAllTenants = () => {

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // 🔢 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

  // 🔍 SEARCH FILTER
  const filteredAgents = agents.filter((agent) =>
    agent.name?.toLowerCase().includes(search.toLowerCase()) ||
    agent.phone?.includes(search) ||
    agent.nationalId?.includes(search)
  )

  // 📄 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredAgents.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const goToPage = (page) => {
    setCurrentPage(page)
  }

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

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, phone or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1) // reset page on search
          }}
          className="w-full lg:w-1/3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl outline-none text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b text-xs border-gray-800">
            <tr>
              <th className="text-left py-4 px-4">#</th>
              <th className="text-left px-4 py-4">Name</th>
              <th className="text-left px-4 py-4">Phone</th>
              <th className="text-left px-4 py-4">Email</th>
              <th className="text-left px-4 py-4">National ID</th>
              <th className="text-left px-4 py-4">Created At</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((agent, index) => (
                <tr key={agent._id} className="border-b border-gray-800">

                  {/* INDEX (global index across pages) */}
                  <td className="py-3 text-gray-400">
                    {startIndex + index + 1}
                  </td>

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
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* 📄 PAGINATION CONTROLS */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === i + 1
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

      </div>

    </section>
  )
}

export default ViewAllTenants