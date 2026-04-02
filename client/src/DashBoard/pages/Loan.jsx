import React, { useEffect, useState } from 'react'
import { IoAdd, IoSearch } from 'react-icons/io5'
import AddLoan from './actions/AddLoan'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import AxiosToastError from '../../utils/AxiosToastError'
import { LuLoader } from "react-icons/lu"
import { FaInfoCircle } from 'react-icons/fa'
import Approve from './actions/Approve'

function Loan() {
  const [customer, setCustomer] = useState(false)
  const [approve, setApprove] = useState(false)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const loansPerPage = 10

  const fetchLoans = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllLoans
      })

      if (response.data.success) {
        setLoans(response.data.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [loans])

  const indexOfLastLoan = currentPage * loansPerPage
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan)
  const totalPages = Math.ceil(loans.length / loansPerPage)

  const formatDate = (dateString) => {
    if (!dateString) return "Waiting for approval"

    const date = new Date(dateString)

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <section className='bg-gray-100  overflow-y-auto scrollbar-hidden'>
      <div className='bg-white p-2 lg:p-6 max-w-7xl mx-auto rounded-2xl shadow-sm'>

        <div className='fixed top-15 right-0 left-0 lg:left-65 bg-white mb-2 p-2 rounded-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-800'>Loans</h2>

            <button
              onClick={() => setCustomer(true)}
              className='flex items-center gap-2 bg-gray-900 cursor-pointer text-white px-4 py-2 rounded-xl text-sm'
            >
              <IoAdd />
              Apply Loan
            </button>
          </div>

          <div className='bg-gray-100 flex items-center justify-between mx-2 text-xs rounded  p-2'>
            <input type="text"  placeholder='search fo loan'/>
            <IoSearch/>
          </div>

          <p className='flex items-center gap-2 text-xs my-2'>
            <FaInfoCircle size={20} />
            Verify the M-Pesa code before approving or rejecting.
          </p>
        </div>

        {
          loading ? (
            <div className='flex justify-center py-10'>
              <LuLoader className='animate-spin text-xl' />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mt-30 h-full overflow-y-auto scrollbar-hidden">
                <table className='min-w-full text-sm'>
                  <thead className='bg-gray-200 text-xs text-gray-600'>
                    <tr>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 hidden md:table-cell">ID</th>
                      <th className="px-4 py-3 hidden md:table-cell">Agent Name</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">M-Pesa Code</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Fee</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Fee Status</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Due Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody className='text-xs'>
                    {currentLoans.map((loan) => (
                      <tr key={loan._id} className='hover:bg-gray-50'>

                        <td className="px-4 py-3 font-medium">
                          {loan.user?.name}
                        </td>

                        <td className="px-4 py-3 hidden md:table-cell">
                          {loan.user?.nationalId}
                        </td>
                         <td className="px-4 py-3 hidden md:table-cell">
                          {/**{loan.agent.name || 'Self application'}*/}
                        </td>
                        <td className="px-4 py-3 text-green-600 font-semibold">
                          KES {loan.amount}
                        </td>

                        <td className="px-4 py-3">
                          {loan.durationWeeks} wks
                        </td>

                        <td className="px-4 py-3">
                          <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-mono">
                            {loan.mpesaCode}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : loan.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {loan.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          KES {loan.processingFee}
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`text-xs font-semibold ${
                            loan.feeStatus === "verified"
                              ? "text-green-600"
                              : "text-yellow-500"
                          }`}>
                            {loan.feeStatus}
                          </span>
                        </td>

                        <td className="px-4 py-3 hidden lg:table-cell">
                          {formatDate(loan.dueDate)}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setApprove(true)}
                              className="px-3 py-1 text-xs cursor-pointer bg-green-500 text-white rounded-lg"
                            >
                              Approve
                            </button>

                            <button
                              className="px-3 py-1 text-xs cursor-pointer bg-red-500 text-white rounded-lg"
                            >
                              Reject
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 px-2">

                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
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
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            </>
          )
        }

      </div>

      {customer && (
        <AddLoan
          close={() => setCustomer(false)}
          fetch={fetchLoans}
        />
      )}

      {approve && (
        <Approve
          close={() => setApprove(false)}
        />
      )}
    </section>
  )
}

export default Loan