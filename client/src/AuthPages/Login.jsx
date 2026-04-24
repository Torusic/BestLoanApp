import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { LuLoaderCircle } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    phone: "",
    password: "",
  });

  // ================= PHONE FORMAT =================
  const formatPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    return "+254" + cleaned;
  };

  const isValidPhone = data.phone.replace(/\D/g, "").length === 9;

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 9);
      setData((prev) => ({
        ...prev,
        phone: cleaned,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.login,
        data: {
          phone: formatPhone(data.phone),
          password: data.password,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setData({
          phone: "",
          password: "",
        });

        const role = response.data.data?.role;
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/adminStats");
        } else if (role === "client") {
          navigate("/clientStats");
        } else if (role === "agent") {
          navigate("/agentStats");
        } else {
          navigate("/");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex text-xs items-center justify-center bg-[#0f172a] px-6">

      <div className="w-full max-w-md">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">
              Enter your details to continue
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PHONE */}
            <div className="space-y-2 grid items-center gap-">
              <label className="text-xs text-gray-400">Phone</label>

              <div className="flex items-center bg-white/90 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-400">

                <span className="px-3 text-gray-700 font-medium bg-gray-100">
                  +254
                </span>

                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="712345678"
                  maxLength={9}
                  className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2 grid items-center gap-2 mt-1">
              <label className="text-xs text-gray-400">Password</label>

              <div className="flex items-center px-3 rounded-lg bg-white/90 focus-within:ring-2 focus-within:ring-green-400">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
                />

                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>

              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-xs text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-green-500" />
                Remember me
              </label>

              <span className="hover:text-green-400 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || !isValidPhone || !data.password}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LuLoaderCircle className="animate-spin" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* DIVIDER */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-3 text-xs text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            {/* REGISTER */}
            <div className="text-center text-sm text-gray-400">
              Don’t have an account?
              <Link
                to="/register"
                className="ml-1 text-green-400 hover:underline"
              >
                Create one
              </Link>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;