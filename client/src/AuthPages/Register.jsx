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

  // ================= PHONE FORMAT =================
  const formatPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    return "+254" + cleaned;
  };

  const isValidPhone = data.phone.replace(/\D/g, "").length === 9;

  // ================= PASSWORD STRENGTH =================
  const getStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", width: 33, color: "bg-red-500" };
    if (score <= 4) return { label: "Medium", width: 66, color: "bg-yellow-400" };
    return { label: "Strong", width: 100, color: "bg-green-500" };
  };

  const strength = getStrength(data.password);

  // ================= RULES =================
  const rules = {
    length: data.password.length >= 8,
    upper: /[A-Z]/.test(data.password),
    lower: /[a-z]/.test(data.password),
    number: /[0-9]/.test(data.password),
    special: /[^A-Za-z0-9]/.test(data.password),
  };

  const isStrongPassword =
    rules.length && rules.upper && rules.lower && rules.number && rules.special;

  const isMatch =
    data.password &&
    data.confirmPassword &&
    data.password === data.confirmPassword;

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 9);
      setData((prev) => ({ ...prev, phone: cleaned }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isMatch) return setError("Passwords do not match");
    if (!isStrongPassword) return setError("Password is too weak");

    try {
      setLoading(true);

      const res = await Axios({
        ...SummaryApi.register,
        data: {
          name: data.name,
          email: data.email,
          phone: formatPhone(data.phone),
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

          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-white">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Join us today
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">

            {/* NAME */}
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            {/* EMAIL + PHONE */}
            <div className="grid gap-3 items-center">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
              />

              <div className="flex w-full items-center bg-white/90 rounded-lg overflow-hidden">
                <span className="px-2 text-gray-700 bg-gray-100">+254</span>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="712345678"
                  className="w-full px-2 py-3 bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* NATIONAL ID */}
            <input
              type="text"
              name="nationalId"
              value={data.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            {/* PASSWORD + CONFIRM */}
            <div className="flex gap-3">

              {/* PASSWORD */}
              <div className="flex items-center w-1/2 px-3 bg-white/90 rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full py-3 bg-transparent outline-none"
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {/* CONFIRM */}
              <div className="flex items-center w-1/2 px-3 bg-white/90 rounded-lg">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className="w-full py-3 bg-transparent outline-none"
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

            </div>

            {/* STRENGTH BAR */}
            {data.password && (
              <div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`${strength.color} h-full`}
                    style={{ width: `${strength.width}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Strength: {strength.label}
                </p>
              </div>
            )}

            {/* RULES */}
            {data.password && (
              <div className="text-xs text-gray-400 space-y-1">
                <p className={rules.length ? "text-green-400" : ""}>✔ 8+ characters</p>
                <p className={rules.upper ? "text-green-400" : ""}>✔ Uppercase</p>
                <p className={rules.lower ? "text-green-400" : ""}>✔ Lowercase</p>
                <p className={rules.number ? "text-green-400" : ""}>✔ Number</p>
                <p className={rules.special ? "text-green-400" : ""}>✔ Special character</p>
              </div>
            )}

            {/* MATCH */}
            {data.confirmPassword && (
              <p className={`text-xs ${isMatch ? "text-green-400" : "text-red-400"}`}>
                {isMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || !isStrongPassword || !isMatch || !isValidPhone}
              className="w-full py-3 bg-green-500 text-white rounded-lg flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LuLoaderCircle className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;