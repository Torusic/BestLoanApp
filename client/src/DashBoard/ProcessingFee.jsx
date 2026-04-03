import React, { useState } from "react";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";

function ProcessingFee({ loan, onClose, refresh }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.makeProcessingFee,
        data: {
          amount: loan.processingFee
        }
      });

      if (response.data.success) {
        toast.success("STK Push sent");
        refresh(); // refresh loan
        onClose(); // close modal
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded lg:max-w-lg lg:w-full md:max-w-md md:w-full max-w-sm w-full">

        <h2 className="lg:text-lg md:text-sm text-xs font-semibold mb-2">
          Pay Processing Fee
        </h2>

        <p className="text-sm mb-4 ">

          Amount: <strong>Ksh {loan.processingFee}</strong>
          <p className="text-xs my-2 text-gray-600 " >(You will recieve an STK push to complete payment)</p>
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 w-full"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default ProcessingFee;