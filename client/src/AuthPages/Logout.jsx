import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

function Logout({ close }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // clear stored auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        close(); // close modal

        // redirect to login
        navigate("/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 flex items-center lg:text-xl text-xs p-3 justify-center bg-gray-900/60 z-50">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-6 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-500 p-3 rounded-full text-2xl">
            ⏻
          </div>
        </div>

        {/* Title */}
        <h2 className="text-sm lg:text-xl font-semibold text-white mb-2">
          Confirm Logout
        </h2>

        {/* Message */}
        <p className="text-gray-100 mb-6">
          Are you sure you want to log out of your account?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">

          <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Logging out..." : "Yes, Logout"}
          </button>

          <button
            onClick={close}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>

        </div>
      </div>
    </section>
  );
}

export default Logout;