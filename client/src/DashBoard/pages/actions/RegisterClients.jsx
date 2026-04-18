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
    email:"",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!/^\d{10,13}$/.test(form.phone))
      newErrors.phone = "Enter a valid phone number";
    if (!form.nationalId.trim())
      newErrors.nationalId = "National ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const response=await Axios({
        ...SummaryApi.agentRegisterClient,
        data:form
      })
      if(response.data.success){
        toast.success(response.data.message);
        setForm({
            name: "",
            phone: "",
            email:"",
            nationalId: "",

        })
      }
      await new Promise((res) => setTimeout(res, 1200));

      console.log("Submitted:", form);

      onClose();
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center p-2 justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Register Client</h2>
            <p className="text-sm text-gray-500">
              Add a new client to your portfolio
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
           <div>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* ID */}
          <div>
            <input
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nationalId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nationalId}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Saving..." : "Register Client"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}