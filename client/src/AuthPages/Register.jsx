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

  // 🔐 Password strength
  const getPasswordStrength = (password) => {
    let score = 0;

    if (!password) return { score: 0, label: "", color: "" };

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 33, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: 66, label: "Medium", color: "bg-yellow-400" };
    return { score: 100, label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(data.password);

  // 🔐 Rules
  const passwordRules = {
    length: data.password.length >= 8,
    uppercase: /[A-Z]/.test(data.password),
    lowercase: /[a-z]/.test(data.password),
    number: /[0-9]/.test(data.password),
    special: /[^A-Za-z0-9]/.test(data.password),
  };

  const isStrongPassword =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  const isPasswordMatch =
    data.password &&
    data.confirmPassword &&
    data.password === data.confirmPassword;

  // HANDLE INPUT
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

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordMatch) return setError("Passwords do not match");
    if (!isStrongPassword) return setError("Please create a stronger password");

    try {
      setLoading(true);

      const formattedPhone = "+254" + data.phone;

      const res = await Axios({
        ...SummaryApi.register,
        data: {
          name: data.name,
          email: data.email,
          phone: formattedPhone,
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

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">

            {/* NAME */}
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full name"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            {/* EMAIL + PHONE */}
            <div className="flex flex-col-2 md:flex-row gap-4">

              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
              />

              {/* PHONE WITH +254 */}
              <div className="flex items-center bg-white/90 rounded-lg overflow-hidden w-full">
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

            {/* NATIONAL ID */}
            <input
              type="text"
              name="nationalId"
              value={data.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            />

            {/* PASSWORD + CONFIRM */}
            <div className="flex flex-col-2 md:flex-row gap-4">

              {/* PASSWORD */}
              <div className="flex items-center px-3 rounded-lg bg-white/90 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
                />
                <span onClick={() => setShowPassword((p) => !p)} className="cursor-pointer text-gray-500">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {/* CONFIRM */}
              <div className="flex items-center px-3 rounded-lg bg-white/90 w-full">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-2 py-3 bg-transparent text-gray-900 outline-none"
                />
                <span onClick={() => setShowConfirm((p) => !p)} className="cursor-pointer text-gray-500">
                  {showConfirm ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

            </div>

            {/* STRENGTH */}
            {data.password && (
              <div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  Strength:{" "}
                  <span className={
                    strength.label === "Weak"
                      ? "text-red-400"
                      : strength.label === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }>
                    {strength.label}
                  </span>
                </p>
              </div>
            )}

            {/* RULES */}
            {data.password && (
              <div className="text-xs space-y-1">
                <p className="text-gray-400">Password must contain:</p>

                <p className={passwordRules.length ? "text-green-400" : "text-gray-400"}>
                  {passwordRules.length ? "✔" : "•"} At least 8 characters
                </p>
                <p className={passwordRules.uppercase ? "text-green-400" : "text-gray-400"}>
                  {passwordRules.uppercase ? "✔" : "•"} Uppercase letter
                </p>
                <p className={passwordRules.lowercase ? "text-green-400" : "text-gray-400"}>
                  {passwordRules.lowercase ? "✔" : "•"} Lowercase letter
                </p>
                <p className={passwordRules.number ? "text-green-400" : "text-gray-400"}>
                  {passwordRules.number ? "✔" : "•"} Number
                </p>
                <p className={passwordRules.special ? "text-green-400" : "text-gray-400"}>
                  {passwordRules.special ? "✔" : "•"} Special character
                </p>
              </div>
            )}

            {/* MATCH */}
            {data.confirmPassword && (
              <p className={`text-xs ${isPasswordMatch ? "text-green-400" : "text-red-400"}`}>
                {isPasswordMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={
                loading ||
                !data.name ||
                data.phone.length !== 9 ||
                !data.nationalId ||
                !isPasswordMatch ||
                !isStrongPassword
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