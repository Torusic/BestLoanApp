import React, { useState } from 'react'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../../utils/AxiosToastError'
import { LuLoader } from 'react-icons/lu'

function Approve({ loan, close, fetch }) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
  try {
    setLoading(true)

    const response = await Axios({
      ...SummaryApi.approve,
      data: {
        loanId: loan._id
      }
    })

    if (response.data.success) {
      toast.success("Approved ✅")
      fetch()
      close()
    }

  } catch (error) {
    AxiosToastError(error)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      
      <div className="bg-gray-800 rounded-lg  p-6 max-w-sm w-full lg:max-w-lg lg:w-full md:max-w-md mdw-full shadow-lg">

        <h2 className="text-lg font-semibold mb-4 text-green-800">
          Approve Loan
        </h2>

        <div className="text-sm text-gray-100 mb-4">
        <p><strong>Customer:</strong> {loan?.user?.name || "Loading..."}</p>
        <p><strong>Amount:</strong> KES {loan?.amount || 0}</p>
        <p><strong>Duration:</strong> {loan?.durationWeeks || 0} weeks</p>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Are you sure you want to approve this loan?
        </p>

        <div className="flex justify-end gap-2">

          <button
            onClick={close}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-3 py-1 bg-green-800 text-white rounded-lg flex items-center gap-2"
          >
            {loading && <LuLoader className="animate-spin" />}
            {loading ? "Approving..." : "Confirm"}
          </button>

        </div>

      </div>
    </div>
  )
}

export default Approve