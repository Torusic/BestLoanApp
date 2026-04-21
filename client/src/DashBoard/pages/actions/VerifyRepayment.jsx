import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CheckCircle, XCircle, Clock, User, Wallet, Hash } from "lucide-react";
import SummaryApi from "../../../common/SummaryApi";
import Axios from "../../../utils/Axios";
import AxiosToastError from "../../../utils/AxiosToastError";

function VerifyRepayment() {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchRepayments = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getAllRepayments,
        params: filter === "all" ? {} : { status: filter },
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

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);

      const response = await Axios({
        ...SummaryApi.verifyRepayment,
        data: {
          repaymentId: id,
          action,
        },
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
      currency: "KES",
    }).format(num || 0);

  const statusUI = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-yellow-500 text-black">
            <Clock size={14} /> Pending
          </span>
        );
      case "verified":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-green-500 text-white">
            <CheckCircle size={14} /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-red-500 text-white">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="p-4 max-w-6xl mx-auto text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Repayment Verification</h2>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mt-2 overflow-x-auto mb-4">
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
            {type}
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
              <div className="flex justify-between items-start text-sm">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 font-semibold">
                    <User size={16} /> {item.user?.name}
                  </p>
                  <p className="text-gray-400">{item.user?.phone}</p>
                </div>

                {statusUI(item.status)}
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-2 text-sm">

                <p className="flex items-center gap-2">
                  <Wallet size={14} />
                  <span>
                    Amount:{" "}
                    <span className="font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={14} />
                  <span>
                    Balance:{" "}
                    <span className="font-semibold">
                      {formatCurrency(item.loan?.balance)}
                    </span>
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Hash size={14} />
                  <span className="text-green-400 font-mono">
                    {item.mpesaCode}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Hash size={14} />
                  <span>{item.accountNumber}</span>
                </p>

              </div>

              {/* ACTIONS */}
              {item.status === "pending" && (
                <div className="flex gap-2 pt-2">

                  <button
                    onClick={() => handleAction(item._id, "approve")}
                    disabled={actionLoading === item._id}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 py-2 rounded-xl text-sm"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(item._id, "reject")}
                    disabled={actionLoading === item._id}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 py-2 rounded-xl text-sm"
                  >
                    <XCircle size={16} />
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