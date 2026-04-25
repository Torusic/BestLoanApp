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
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  // ================= PHONE VALIDATION =================
  const cleanPhone = data.phone.replace(/\D/g, "");
  const isValidPhone =
    cleanPhone.length === 10 && cleanPhone.startsWith("07");

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
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 TERMS VALIDATION FIX (IMPORTANT)
    if (!termsAccepted) {
      return setError(
        "Please agree to the Terms and Conditions before creating an account."
      );
    }

    if (!isValidPhone)
      return setError("Phone must start with 07 and be 10 digits");

    if (!isMatch)
      return setError("Passwords do not match");

    if (!isStrongPassword)
      return setError("Password is too weak");

    try {
      setLoading(true);

      const res = await Axios({
        ...SummaryApi.register,
        data: {
          name: data.name,
          email: data.email,
          phone: cleanPhone,
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

        setTermsAccepted(false);
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

  const isFormValid =
    isValidPhone &&
    isStrongPassword &&
    isMatch &&
    termsAccepted &&
    data.name &&
    data.email &&
    data.nationalId;

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6">

      <div className="w-full max-w-md">

        <div className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-8">

          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-white">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">Join us today</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">

            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 outline-none"
            />

            <input
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 outline-none"
            />

            {/* PHONE */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <span className="px-3 text-gray-700">+254</span>
              <input
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="0712345678"
                className="w-full px-2 py-3 bg-white text-gray-900 outline-none"
              />
            </div>

            <input
              name="nationalId"
              value={data.nationalId}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 outline-none"
            />

            {/* PASSWORD */}
            <div className="flex gap-3">

              <div className="flex items-center w-1/2 px-3 bg-white rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full py-3 bg-white text-gray-900 outline-none"
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="flex items-center w-1/2 px-3 bg-white rounded-lg">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className="w-full py-3 bg-white text-gray-900 outline-none"
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

            </div>

            {/* PASSWORD STRENGTH */}
            {data.password && (
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`${strength.color} h-full transition-all`}
                    style={{ width: `${strength.width}%` }}
                  />
                </div>
                <p className="text-gray-300 text-xs">
                  Strength: {strength.label}
                </p>
              </div>
            )}

            {/* RULES */}
            {data.password && (
              <div className="text-xs space-y-1 text-gray-300">
                <p className={rules.length ? "text-green-400" : ""}>✔ 8+ characters</p>
                <p className={rules.upper ? "text-green-400" : ""}>✔ Uppercase</p>
                <p className={rules.lower ? "text-green-400" : ""}>✔ Lowercase</p>
                <p className={rules.number ? "text-green-400" : ""}>✔ Number</p>
                <p className={rules.special ? "text-green-400" : ""}>✔ Special character</p>
              </div>
            )}

            {/* TERMS */}
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I agree to{" "}
                <Link to="/terms-and-conditions" className="text-green-400 underline">
                  Terms & Conditions
                </Link>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-3 bg-green-500 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
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

                        <div className="text-center text-sm text-gray-400">
                          Already have an account?
                          <Link to="/login" className="ml-1 text-green-400 hover:underline">
                            Login
                          </Link>
                        </div>

          </form>

        </div>
      </div>
    </section>
  );
};

export default Register;