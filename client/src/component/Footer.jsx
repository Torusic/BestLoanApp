import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MdDashboard, MdHome } from "react-icons/md";
import { IoPeople, IoSettings } from "react-icons/io5";
import { FaHistory, FaMoneyBillWave } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";

function Footer() {
  const location = useLocation();
  const role = localStorage.getItem("role") || "client";

  const navItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: <MdDashboard size={22} />,
        path: "/adminStats/adminDashboard",
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
        path: "/clientStats/clientDashboard",
        roles: ["client"],
      },
       {
            name: "Dashboard",
            icon: <MdDashboard size={22} />,
            path: "/clientStats/agentDashboard",
            roles: ["agent"],
          },
      {
        name: "My Loan",
        icon: <GrMoney size={20} />,
        path: "/clientStats/myloan",
        roles: ["client", "agent"],
      },
      {
        name: "Apply",
        icon: <FaMoneyBillWave size={20} />,
        path: "/clientStats/apply",
        roles: ["client", "agent"],
      },
      {
        name: "History",
        icon: <FaHistory size={20} />,
        path: "/clientStats/history",
        roles: ["client", "agent"],
      },
    ],
    []
  );

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <section className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 px-3 py-2">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {filteredNav.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-10 h-10 bg-green-500/20 rounded-xl"
                  />
                )}

                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`text-[10px] font-medium mt-1 transition-all ${
                    isActive ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Footer;