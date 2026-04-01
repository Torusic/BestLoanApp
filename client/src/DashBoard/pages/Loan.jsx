import React, { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import AddLoan from './actions/AddLoan'

function Loan() {
  const [customer, setCustomer] = useState(false)
  const [loans, setLoans] = useState([
    {
      id: 1,
      name: "John Doe",
      idNumber: "12345678",
      amount: "KES 50,000",
      duration: 12,
      mpesaCode: 'GDGDJIDHHD',
      status: "Approved",
      fee: "KES 500",
      feeStatus: "Paid",
      verified: "Yes",
      paid: "KES 20,000",
      repayment: "Ongoing"
    },
    {
      id: 2,
      name: "Jane Smith",
      idNumber: "87654321",
      amount: "KES 30,000",
      duration: 8,
      mpesaCode: 'DHHDGGFJD',
      status: "Pending",
      fee: "KES 300",
      feeStatus: "Unpaid",
      verified: "No",
      paid: "KES 0",
      repayment: "Not Started"
    },
    {
      id: 3,
      name: "Mike Ross",
      idNumber: "11223344",
      amount: "KES 70,000",
      duration: 16,
      mpesaCode: 'JDGGDUUDH',
      status: "Approved",
      fee: "KES 700",
      feeStatus: "Paid",
      verified: "Yes",
      paid: "KES 50,000",
      repayment: "Ongoing"
    }
  ])

  const handleApprove = (id) => {
    setLoans(prev =>
      prev.map(loan =>
        loan.id === id
          ? { ...loan, status: "Approved", verified: "Yes", feeStatus: "Paid" }
          : loan
      )
    )
  }

  const handleReject = (id) => {
    setLoans(prev =>
      prev.map(loan =>
        loan.id === id
          ? { ...loan, status: "Rejected", verified: "No" }
          : loan
      )
    )
  }

  return (
    <section className='bg-gray-100 min-h-screen overflow-y-auto p-2 rounded-lg'>
      <div className='bg-white p-4 lg:p-6 max-w-7xl mx-auto rounded-2xl shadow-sm'>

        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-800'>Loans</h2>

          <button
            onClick={() => setCustomer(true)}
            className='flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm'
          >
            <IoAdd />
            Apply Loan
          </button>
        </div>

        <div className="overflow-x-auto w-full scrollbar-hidden">
          <table className='min-w-full w-full text-sm overflow-x-auto '>
            
            <thead className='bg-gray-50 text-xs text-gray-600'>
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">M-Pesa Code</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Fee</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Fee Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className='text-xs'>
              {loans.map((loan) => (
                <tr key={loan.id} className=' hover:bg-gray-50'>
                  
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {loan.name}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell">
                    {loan.idNumber}
                  </td>

                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {loan.amount}
                  </td>

                  <td className="px-4 py-3">
                    {loan.duration} wks
                  </td>

                  <td className="px-4 py-3">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-mono tracking-wider">
                      {loan.mpesaCode}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      loan.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : loan.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {loan.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    {loan.fee}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-semibold ${
                      loan.feeStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
                      {loan.feeStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(loan.id)}
                        disabled={loan.status === "Approved"}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg disabled:opacity-40"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(loan.id)}
                        disabled={loan.status === "Rejected"}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg disabled:opacity-40"
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

      </div>

      {customer && (
        <AddLoan close={() => setCustomer(false)} />
      )}
    </section>
  )
}

export default Loan