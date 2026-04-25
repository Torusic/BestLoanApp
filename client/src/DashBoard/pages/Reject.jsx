import React, { useState } from 'react'
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import { LuLoader } from 'react-icons/lu';

function Reject({ loan, close, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.reject,
        data: { loanId: loan._id },
      });

      if (response.data.success) {
        toast.success("Loan rejected successfully");
        fetch();
        close();
      } else {
        toast.error(response.data.message || "Failed to reject loan");
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex p-2 items-center justify-center z-50">

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-red-400">
          Reject Loan
        </h2>

        <p className="text-sm text-gray-300">
          This action will permanently reject the loan application.
        </p>

        {/* LOAN DETAILS */}
        <div className="bg-gray-800 p-3 rounded-xl text-sm text-gray-300 space-y-1">
          <p>
            <span className="text-gray-400">Customer:</span>{" "}
            {loan?.user?.name}
          </p>
          <p>
            <span className="text-gray-400">Amount:</span>{" "}
            KES {loan?.amount}
          </p>
          <p>
            <span className="text-gray-400">Status:</span>{" "}
            {loan?.status}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={close}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <LuLoader className="animate-spin" />
                Rejecting...
              </>
            ) : (
              "Confirm Reject"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Reject