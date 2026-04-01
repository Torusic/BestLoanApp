import React from "react";
import Footer from "../../component/Footer";
import { IoIosPersonAdd } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { FaHistory } from "react-icons/fa";
import { motion } from "framer-motion";

const Card = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
  >
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className={`text-xl font-bold mt-1 ${color}`}>{value}</h2>
    </div>
    <div className="text-2xl">{icon}</div>
  </motion.div>
);

const StatBox = ({ title, value, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
    <p className="text-xs text-gray-500">{title}</p>
    <h2 className={`text-xl font-bold mt-1 ${color}`}>{value}</h2>
  </div>
);

const AdminDashboard = () => {
  return (
    <section className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Overview of system performance and loan activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols md:grid-cols-3 gap-4 mb-6">
          <StatBox
            title="Total Amount Issued"
            value="KES 12,800"
            color="text-green-600"
          />
          
        </div>
          <div className="grid grid-cols-2 my-2 items-center  justify-between gap-2 ">
            <StatBox
            title="Total Amount Repaid"
            value="KES 12,800"
            color="text-blue-600"
          />
          <StatBox
            title="Net Balance"
            value="KES 0"
            color="text-purple-600"
          />

          </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <Card
            title="Total Clients"
            value="128"
            icon={<IoIosPersonAdd className="text-green-400" />}
            color="text-gray-800"
          />
          <Card
            title="Total Agents"
            value="8"
            icon={<IoIosPersonAdd className="text-blue-400" />}
            color="text-blue-500"
          />
          <Card
            title="Loans Approved"
            value="18"
            icon={<FcApproval />}
            color="text-gray-800"
          />
          <Card
            title="Loans Pending"
            value="9"
            icon={<FaHistory className="text-yellow-400" />}
            color="text-yellow-500"
          />
        </div>

      

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Agent Performance
            </h3>
            <input
              type="text"
              placeholder="Search agent..."
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none"
            />
          </div>

          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Agent Name</th>
                <th className="px-4 py-3 text-left">Total Loans</th>
                <th className="px-4 py-3 text-left">Amount Issued</th>
              </tr>
            </thead>

            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  John Doe
                </td>
                <td className="px-4 py-3">12</td>
                <td className="px-4 py-3 text-green-600">KES 45,000</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  Jane Smith
                </td>
                <td className="px-4 py-3">8</td>
                <td className="px-4 py-3 text-green-600">KES 30,000</td>
              </tr>
            </tbody>
          </table>
        </div>

      
      </div>
    </section>
  );
};

export default AdminDashboard;