import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import SummaryApi from "../../../common/SummaryApi";
import Axios from "../../../utils/Axios";
import AxiosToastError from "../../../utils/AxiosToastError";

function VerifyRepayment() {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");
  const[approve,setApprove]=useState(false)
  // 🔄 Fetch repayments
  const fetchRepayments = async () => {
    try {
      setLoading(true);

     const response = await Axios({
      ...SummaryApi.getAllRepayments,
      params: filter === "all" ? {} : { status: filter }
    });

      if (response.data.success) {
        setRepayments(response.data.data);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepayments();
  }, [filter]);

  // ✅ Approve / Reject
  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);

      const response = await Axios({
        ...SummaryApi.verifyRepayment,
        data: {
          repaymentId: id,
          action
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchRepayments();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES"
    }).format(num || 0);

  return (
    <section className="p-4 max-w-6xl mx-auto text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Repayment Verification</h2>

        {/* FILTER */}
      
      </div> 
      <div className="flex gap-2 mt-2 overflow-x-auto mb-2">

        {["all", "pending", "verified", "rejected"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              filter === type
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {type.replace("_", " ")}
          </button>
        ))}

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : repayments.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No repayments found
        </div>
      ) : (
        <div className="grid gap-4">

          {repayments.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-3"
            >

              {/* USER */}
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-semibold">{item.user?.name}</p>
                  <p className="text-gray-400">{item.user?.phone}</p>
                </div>

                <span className={`text-xs p-1 flex items-center justify-center rounded ${
                  item.status === "pending"
                    ? "bg-yellow-500"
                    : item.status === "verified"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}>
                  {item.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-2 text-sm">

                <p>
                  Amount:
                  <span className="ml-1 font-semibold">
                    {formatCurrency(item.amount)}
                  </span>
                </p>

                <p>
                  Balance:
                  <span className="ml-1 font-semibold">
                    {formatCurrency(item.loan?.balance)}
                  </span>
                </p>

                <p>
                  M-Pesa Code:
                  <span className="ml-1 font-mono text-green-400">
                    {item.mpesaCode}
                  </span>
                </p>

                <p>
                  Account:
                  <span className="ml-1">
                    {item.accountNumber}
                  </span>
                </p>

              </div>

              {/* ACTIONS */}
              {item.status === "pending" && (
                <div className="flex gap-2 pt-2">

                  <button
                    onClick={() => handleAction(item._id, "approve")}
                    disabled={actionLoading === item._id}
                    className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-xl text-sm flex justify-center items-center gap-2"
                  >
                    {actionLoading === item._id && (
                      <Loader2 className="animate-spin" size={14} />
                    )}
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(item._id, "reject")}
                    disabled={actionLoading === item._id}
                    className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-xl text-sm"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </section>
  );
}

export default VerifyRepayment;