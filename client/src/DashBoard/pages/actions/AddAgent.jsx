import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../../../utils/AxiosToastError";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddAgent({ close, fetchDashboard }) {
  const navigate = useNavigate();

  const [agent, setAgent] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10); // ✅ 10 digits
      setAgent((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setAgent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!agent.name.trim()) err.name = "Name required";

    if (!/^0\d{9}$/.test(agent.phone)) {
      err.phone = "Enter valid 07XXXXXXXX format (10 digits)";
    }

    if (agent.email && !/^\S+@\S+\.\S+$/.test(agent.email)) {
      err.email = "Invalid email";
    }

    if (!agent.nationalId.trim()) {
      err.nationalId = "National ID required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleAddAgent = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...agent,
        phone: agent.phone.replace(/\D/g, ""), // still send raw 10 digits
      };

      const response = await Axios({
        ...SummaryApi.addAgent,
        data: payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setAgent({
          name: "",
          email: "",
          phone: "",
          nationalId: "",
        });

        fetchDashboard();
        close();
        navigate("/adminStats");
      } else {
        toast.error(response.data.message || "Failed to add agent");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-lg mx-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-sm font-semibold text-white">Add New Agent</h2>
            <p className="text-xs text-gray-400">
              Register a new loan agent
            </p>
          </div>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <IoClose className="text-white text-xl" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleAddAgent} className="p-5 space-y-4">

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-400">Full Name</label>
            <input
              name="name"
              value={agent.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              name="email"
              value={agent.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs text-gray-400">Phone</label>

            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden mt-1">

              <span className="px-3 text-gray-300">+254</span>

              <input
                name="phone"
                value={agent.phone}
                onChange={handleChange}
                placeholder="0712345678"
                maxLength={10}
                className="w-full p-3 bg-transparent text-white outline-none"
              />
            </div>

            {errors.phone && (
              <p className="text-red-400 text-xs">{errors.phone}</p>
            )}
          </div>

          {/* NATIONAL ID */}
          <div>
            <label className="text-xs text-gray-400">National ID</label>
            <input
              name="nationalId"
              value={agent.nationalId}
              onChange={handleChange}
              placeholder="Enter ID number"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.nationalId && (
              <p className="text-red-400 text-xs">{errors.nationalId}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddAgent;