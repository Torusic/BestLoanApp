import React from "react";
import { FaRegClock } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { MdAttachMoney, MdDashboard } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";
import ActiveLoan from "./ActiveLoan";

function ClientDashboard() {
  return (
    <section className="flex justify-center p-3 bg-gray-950">

      <div className="w-full max-w-6xl space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl shadow-lg">

          <div className="flex items-center gap-2">
            <MdDashboard className="text-green-400" size={22} />
            <div>
              <h1 className="text-white text-lg font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm">Loan overview & activity</p>
            </div>
          </div>

          <Link
            to="/clientStats/apply"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs px-5 py-2 rounded-xl"
          >
            <FiTrendingUp size={16} />
            Apply Loan
          </Link>

        </div>

        {/* LOAN LIMIT CARD */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 rounded-2xl shadow-lg flex items-center gap-4">

          <MdAttachMoney size={45} className="text-white" />

          <div>
            <p className="text-white text-sm">Loan Limit</p>
            <h2 className="text-white text-xl font-bold">
              KES 5,000 – 95,000
            </h2>
          </div>

        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* REPAYMENT PERIOD */}
          <div className="bg-gradient-to-r from-green-500 to-green-400 p-4 rounded-2xl shadow-lg flex items-center gap-3">

            <GiSandsOfTime size={35} className="text-white" />

            <div>
              <p className="text-white text-sm">Repayment Period</p>
              <p className="text-white font-bold">4 – 24 Weeks</p>
            </div>

          </div>

          {/* PROCESSING TIME */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-4 rounded-2xl shadow-lg flex items-center gap-3">

            <FaRegClock size={30} className="text-gray-800" />

            <div>
              <p className="text-gray-800 text-sm">Processing Time</p>
              <p className="text-gray-900 font-bold">Within 24 Hours</p>
            </div>

          </div>

        </div>

        {/* ACTIVE LOAN SECTION */}
        <div className="bg-gray-900 rounded-2xl p-3 shadow-lg">

          <div className="flex items-center gap-2 mb-2 text-gray-300">
            <HiOutlineDocumentText size={18} />
            <span className="text-sm">Active Loan</span>
          </div>

          <ActiveLoan />

        </div>

      </div>

    </section>
  );
}

export default ClientDashboard;