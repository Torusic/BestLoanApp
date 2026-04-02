import React from 'react'
import { MdHome } from "react-icons/md";
import { IoPeople, IoSettings } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation()

  const navItems = [
    {
      name: "Home",
      icon: <MdHome size={22} />,
      path: "/adminStats/adminDashboard"
    },
     {
      name: "Loans",
      icon: <FaMoneyBillWave size={22} />,
      path: "/adminStats/loans"
    },
    {
      name: "Customers",
      icon: <IoPeople size={22} />,
      path: "/adminStats/customers"
    },
   
    {
      name: "Repayments",
      icon: <GiReceiveMoney size={22} />,
      path: "/adminStats/repayments"
    },
    {
      name: "Settings",
      icon: <IoSettings size={22} />,
      path: "/adminStats/settings"
    }
  ]

  return (
    <section className="sticky bottom-0 z-10001 bg-gray-100 border-t border-gray-100 shadow-lg px-4 py-2 rounded-t-2xl">

      <div className="flex items-center justify-between">

        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? "bg-green-50" : ""
                }`}
              >
                {item.icon}
              </div>

              <span className="text-[11px] mt-1 font-medium">
                {item.name}
              </span>
            </Link>
          )
        })}

      </div>

    </section>
  )
}

export default Footer