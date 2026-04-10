import React, { useEffect, useState } from 'react'
import { IoAdd, IoSearch } from 'react-icons/io5'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'
import { LuLoader } from "react-icons/lu"
import AddLoan from './actions/AddLoan'

function Customers() {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddLoan, setShowAddLoan] = useState(false)
  const [search, setSearch] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const clientsPerPage = 10

  // FETCH CLIENTS
  const fetchClients = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.myClients
      })

      if (response.data.success) {
        const data = response.data.data.clients
        setClients(data)
        setFilteredClients(data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  // SEARCH FILTER
  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.nationalId.includes(search)
    )

    setFilteredClients(filtered)
    setCurrentPage(1)
  }, [search, clients])

  // PAGINATION
  const indexOfLast = currentPage * clientsPerPage
  const indexOfFirst = indexOfLast - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  return (
    <section className='bg-gray-800 min-h-screen overflow-y-auto scrollbar-hidden'>
      <div className='bg-gray-800 p-2 lg:p-6 max-w-7xl mx-auto rounded-2xl shadow-sm'>

        {loading ? (
          <div className='flex justify-center py-10'>
            <LuLoader className='animate-spin text-xl text-white' />
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className='flex flex-col lg:flex-row justify-between items-center gap-4 mb-6'>
              <h2 className='text-xl font-bold text-white'>Customers</h2>

              <button
                onClick={() => setShowAddLoan(true)}
                className='flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm'
              >
                <IoAdd />
                Apply Loan
              </button>
            </div>

            {/* SEARCH */}
            <div className='bg-gray-700 flex items-center justify-between text-white rounded p-2 mb-4'>
              <input
                type="text"
                placeholder='Search by name, phone or ID'
                className='outline-none bg-transparent w-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IoSearch />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className='min-w-full'>
                <thead className='bg-gray-900 text-xs text-white'>
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px- py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">National ID</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Action</th>

                    
                  </tr>
                </thead>

                <tbody className='text-xs text-white'>
                  {currentClients.map((client) => (
                    <tr key={client._id} className='hover:bg-green-900'>
                      <td className="px-4 py-3">{client.name}</td>
                      <td className="px-4 py-3">{client.phone}</td>
                      <td className="px-4 py-3">{client.email || "-"}</td>
                      <td className="px-4 py-3">{client.nationalId}</td>
                      <td className="px-4 py-3">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>

                     <td className="px-4 py-3">
                      <div className="flex gap-2">

                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setSelectedCustomer(client)
                            setShowEditCustomer(true)
                          }}
                          className="px-3 py-1 text-xs bg-blue-600 rounded-lg"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="px-3 py-1 text-xs bg-red-600 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">

              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-900 text-white rounded disabled:opacity-40"
              >
                Prev
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-white text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-900 text-white rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </>
        )}

      </div>

      {/* APPLY LOAN MODAL */}
      {showAddLoan && (
        <AddLoan
          close={() => setShowAddLoan(false)}
          fetch={fetchClients}
        />
      )}
    </section>
  )
}

export default Customers