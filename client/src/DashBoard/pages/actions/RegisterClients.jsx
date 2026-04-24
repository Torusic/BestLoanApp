import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";

export default function RegisterClients({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    // ✅ STRICT 10 DIGITS
    if (phoneDigits.length !== 10) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!form.nationalId.trim()) {
      newErrors.nationalId = "National ID is required";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "phone") {
      // ✅ limit to 10 digits only
      const cleaned = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: cleaned,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        phone: form.phone.replace(/\D/g, ""), // RAW 10 digits ONLY
      };

      const response = await Axios({
        ...SummaryApi.agentRegisterClient,
        data: payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setForm({
          name: "",
          phone: "",
          email: "",
          nationalId: "",
        });

        onClose();
      } else {
        toast.error(response.data.message || "Failed to register client");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Register Client</h2>
            <p className="text-sm text-gray-500">
              Add a new client to your portfolio
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
              <span className="px-3 bg-gray-200 dark:bg-gray-700 text-sm">
                +254
              </span>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="7123456789"
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>

            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email (optional)"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* NATIONAL ID */}
          <div>
            <input
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none"
            />
            {errors.nationalId && (
              <p className="text-red-500 text-xs mt-1">{errors.nationalId}</p>
            )}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Saving..." : "Register Client"}
          </button>

        </div>

      </motion.div>
    </div>
  );
}