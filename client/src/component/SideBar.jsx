import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { IoPeople, IoSettings } from "react-icons/io5";
import { MdDashboard, MdHome } from "react-icons/md";

function SideBar() {
  const location = useLocation();
  const role = localStorage.getItem("role") || "client";

  const navItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: <MdDashboard size={22} />,
        path: "/adminStats",
        roles: ["admin"],
      },
      {
        name: "Loans",
        icon: <FaMoneyBillWave size={22} />,
        path: "/adminStats/loans",
        roles: ["admin"],
      },
      {
        name: "Customers",
        icon: <IoPeople size={22} />,
        path: "/adminStats/customers",
        roles: ["admin"],
      },
      {
        name: "Repayments",
        icon: <GiReceiveMoney size={22} />,
        path: "/adminStats/repayments",
        roles: ["admin"],
      },
      {
        name: "Settings",
        icon: <IoSettings size={22} />,
        path: "/adminStats/settings",
        roles: ["admin"],
      },
      {
           name: "Home",
           icon: <MdHome size={22} />,
           path: "/clientStats",
           roles: ["client"],
         },
          {
               name: "Dashboard",
               icon: <MdDashboard size={22} />,
               path: "/agentStats",
               roles: ["agent"],
             },
      {
        name: "My Loan",
        icon: <GrMoney size={20} />,
        path: "/clientStats/myloan",
        roles: ["client", "agent"],
      },
      {
        name: "Apply Loan",
        icon: <FaMoneyBillWave size={20} />,
        path: "/clientStats/apply",
        roles: ["client", "agent"],
      },
    
      {
        name: "Loan History",
        icon: <FaHistory size={20} />,
        path: "/clientStats/history",
        roles: ["client", "agent"],
      },
        {
        name: "Settings",
        icon: <IoSettings size={22} />,
        path: "/adminStats/settings",
        roles: ["agent","client"],
      },
    ],
    []
  );

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden lg:flex flex-col fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-lg border-r border-gray-800 p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg font-bold text-white">Best Loan Offers</h1>
        <p className="text-xs text-gray-400">Smart lending system</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        {filteredNav.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path} className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-green-500/10 text-green-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-green-400" : "text-gray-400"}`}>
                  {item.icon}
                </span>

                <span className="text-sm font-medium">{item.name}</span>
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">© 2026 Best Loan System</p>
          <p className="text-[10px] text-gray-500 mt-1">SaaS Edition</p>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;