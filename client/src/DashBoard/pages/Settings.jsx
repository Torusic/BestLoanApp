import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPerson, IoSettings, IoShieldCheckmark } from "react-icons/io5";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
  });

  const isMatch =
    data.newPassword &&
    data.confirmPassword &&
    data.newPassword === data.confirmPassword;

// PASSWORD STRENGTH (IMPROVED)
const getPasswordStrength = (password) => {
  let score = 0;

  if (!password) {
    return {
      label: "",
      value: 0,
      color: "",
      tips: [],
    };
  }

  const tips = [];

  // Length check
  if (password.length >= 6) score += 1;
  else tips.push("Use at least 6 characters");

  if (password.length >= 8) score += 1;
  else tips.push("Make it at least 8 characters");

  // Lowercase
  if (/[a-z]/.test(password)) score += 1;
  else tips.push("Add lowercase letters");

  // Uppercase
  if (/[A-Z]/.test(password)) score += 1;
  else tips.push("Add uppercase letters");

  // Numbers
  if (/[0-9]/.test(password)) score += 1;
  else tips.push("Add numbers");

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else tips.push("Add special characters");

  let label = "Weak";
  let color = "bg-red-500";
  let value = (score / 6) * 100;

  if (score >= 4 && score <= 5) {
    label = "Medium";
    color = "bg-yellow-400";
  }

  if (score === 6) {
    label = "Strong";
    color = "bg-green-500";
  }

  return { label, value, color, tips };
};

const passwordStrength = getPasswordStrength(data.newPassword);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // FETCH USER SETTINGS
  const fetchSettings = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getUserSettings,
      });

      if (res.data.success) {
        const user = res.data.data;
        setData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          nationalId: user.nationalId || "",
          notifications: user.notifications ?? true,
        }));
      }
    } catch (err) {
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      setLoading(true);

      const res = await Axios({
        ...SummaryApi.updateProfile,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          nationalId: data.nationalId,
        },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    if (!isMatch) return toast.error("Passwords do not match");

    try {
      setLoading(true);

      const res = await Axios({
        ...SummaryApi.changePassword,
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });

      if (res.data.success) {
        toast.success("Password updated");
        setData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE NOTIFICATIONS
  const toggleNotifications = async () => {
    try {
      const newValue = !data.notifications;

      setData((prev) => ({
        ...prev,
        notifications: newValue,
      }));

      await Axios({
        ...SummaryApi.toggleNotifications,
        data: { notifications: newValue },
      });

      toast.success("Preferences updated");
    } catch (err) {
      toast.error("Failed to update preferences");
    }
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: <IoPerson size={18} /> },
    { key: "security", label: "Security", icon: <IoShieldCheckmark size={18} /> },
    { key: "preferences", label: "Preferences", icon: <IoSettings size={18} /> },
  ];

  return (
    <section className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-xl font-semibold">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                activeTab === tab.key
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px]">

          <AnimatePresence mode="wait">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="px-4 py-3 rounded-lg bg-white text-gray-600"
                />

                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="px-4 py-3 rounded-lg bg-white text-gray-600"
                />

                <input
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="px-4 py-3 rounded-lg bg-white text-gray-600"
                />

                <input
                  name="nationalId"
                  value={data.nationalId}
                  onChange={handleChange}
                  placeholder="National ID"
                  className="px-4 py-3 rounded-lg bg-white text-gray-600"
                />

                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-5 py-2 bg-green-500 rounded-lg"
                >
                  Save Changes
                </button>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center bg-white rounded-lg px-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={data.currentPassword}
                    onChange={handleChange}
                    placeholder="Current password"
                    className="w-full py-3 text-black outline-none"
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div className="flex items-center bg-white rounded-lg px-3">
                <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                    className="w-full py-3 text-black outline-none"
                />
                <span
                    className="cursor-pointer text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                </div>

                {/* PASSWORD STRENGTH */}
                {/* PASSWORD STRENGTH BAR */}
                {/* PASSWORD STRENGTH BAR */}
        {data.newPassword && (
        <div className="w-full space-y-2">

            {/* Bar */}
            <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                style={{ width: `${passwordStrength.value}%` }}
            />
            </div>

            {/* Label */}
            <p className="text-xs text-gray-300">
            Password Strength:{" "}
            <span
                className={
                passwordStrength.label === "Strong"
                    ? "text-green-400"
                    : passwordStrength.label === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
            >
                {passwordStrength.label}
            </span>
            </p>

            {/* Suggestions */}
            {passwordStrength.tips.length > 0 && (
            <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                {passwordStrength.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
                ))}
            </ul>
            )}
        </div>
        )}
            <div className="flex items-center bg-white rounded-lg px-3">
            <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full py-3 text-black outline-none"
            />
            <span
                className="cursor-pointer text-gray-700"
                onClick={() => setShowConfirm(!showConfirm)}
            >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>

                <button
                  onClick={changePassword}
                  className="px-5 py-2 bg-green-500 rounded-lg"
                >
                  Update Password
                </button>
              </motion.div>
            )}

            {/* PREFERENCES */}
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                className="flex justify-between items-center"
              >
                <span>Enable Notifications</span>
                <input
                  type="checkbox"
                  checked={data.notifications}
                  onChange={toggleNotifications}
                  className="accent-green-500"
                />
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default Settings;