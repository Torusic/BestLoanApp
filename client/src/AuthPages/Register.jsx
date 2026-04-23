import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
  });

  // 🔐 Password strength function
  const getPasswordStrength = (password) => {
    let score = 0;

    if (!password) return { score: 0, label: "", color: "" };

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { score: 33, label: "Weak", color: "bg-red-500" };
    } else if (score <= 4) {
      return { score: 66, label: "Medium", color: "bg-yellow-400" };
    } else {
      return { score: 100, label: "Strong", color: "bg-green-500" };
    }
  };

  const strength = getPasswordStrength(data.password);

  const isPasswordMatch =
    data.password &&
    data.confirmPassword &&
    data.password === data.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!isPasswordMatch) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await Axios({
        ...SummaryApi.register,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          nationalId: data.nationalId,
          password: data.password,
        },
      });

      if (res.data.success) {
        setData({
          name: "",
          email: "",
          phone: "",
          nationalId: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8">

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Create your account
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Join and start your experience
            </p>
          </div>

          {/* 🔴 ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full name"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Email address"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            <input
              type="text"
              name="nationalId"
              value={data.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            {/* PASSWORD */}
            <div className="flex items-center px-3 rounded-lg bg-white/90">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
              />
              <span
                onClick={() => setShowPassword((p) => !p)}
                className="cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* 🔐 PASSWORD STRENGTH */}
            {data.password && (
              <div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: `${strength.score}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  Strength:{" "}
                  <span
                    className={
                      strength.label === "Weak"
                        ? "text-red-400"
                        : strength.label === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    {strength.label}
                  </span>
                </p>
              </div>
            )}

            {/* CONFIRM PASSWORD */}
            <div className="flex items-center px-3 rounded-lg bg-white/90">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
              />
              <span
                onClick={() => setShowConfirm((p) => !p)}
                className="cursor-pointer text-gray-500"
              >
                {showConfirm ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* MATCH CHECK */}
            {data.confirmPassword && (
              <p
                className={`text-xs ${
                  isPasswordMatch ? "text-green-400" : "text-red-400"
                }`}
              >
                {isPasswordMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !data.name ||
                !data.phone ||
                !data.nationalId ||
                !data.password ||
                !isPasswordMatch
              }
              className="flex items-center justify-center gap-2 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LuLoaderCircle className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-sm text-center text-gray-400">
              Already have an account?
              <Link to="/login" className="ml-1 text-green-400 hover:underline">
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;