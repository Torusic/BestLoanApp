import React, { useState } from 'react'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../../utils/AxiosToastError'
import { LuLoader } from 'react-icons/lu'

function Approve({ loan, close, fetch }) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    if (!loan?._id) {
      toast.error("Invalid loan selected")
      return
    }

    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.approve, // ✅ MUST MATCH BACKEND ROUTE
        data: {
          loanId: loan._id
        }
      })

      if (response.data.success) {
        toast.success("Loan approved successfully ✅")
        fetch()
        close()
      } else {
        toast.error(response.data.message || "Approval failed")
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 z-50">

      <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-700">

        <h2 className="text-lg font-semibold text-green-500 mb-4">
          Approve Loan
        </h2>

        <div className="text-sm space-y-2 mb-4 bg-gray-800 p-3 rounded-lg">
          <p><span className="text-gray-400">Customer:</span> {loan?.user?.name || "N/A"}</p>
          <p><span className="text-gray-400">Amount:</span> KES {loan?.amount || 0}</p>
          <p><span className="text-gray-400">Duration:</span> {loan?.durationWeeks || 0} weeks</p>
          <p><span className="text-gray-400">Fee Status:</span> {loan?.feeStatus || "pending"}</p>
        </div>

        <p className="text-xs text-gray-400 mb-5">
          This action will mark the loan as approved and verified.
        </p>

        <div className="flex justify-end gap-2">

          <button
            onClick={close}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded-lg flex items-center gap-2 disabled:opacity-50"
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