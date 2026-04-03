import React from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import { IoPeople, IoSettings } from 'react-icons/io5'
import { MdDashboard, MdHome } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'

function SideBar() {
    const location = useLocation()

   const role = localStorage.getItem("role");

  const navItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={22} />,
      path: "/adminStats/adminDashboard",
      roles:['admin']
    },
     {
      name: "Loans",
      icon: <FaMoneyBillWave size={22} />,
      path: "/adminStats/loans",
      roles:['admin']
    },
    {
      name: "Customers",
      icon: <IoPeople size={22} />,
      path: "/adminStats/customers",
      roles:['admin']
    },
   
    {
      name: "Repayments",
      icon: <GiReceiveMoney size={22} />,
      path: "/adminStats/repayments",
      roles:['admin']
    },
    {
      name: "Settings",
      icon: <IoSettings size={22} />,
      path: "/adminStats/settings",
       roles:['admin']
      
    },
        {
      name: "Home",
      icon: <MdHome size={22} />,
      path: "/clientStats/clientDashboard",
      roles:['client']
    },
    ,
     {
      name: "Apply",
      icon: <FaMoneyBillWave size={30} />,
      path: "/clientStats/apply",
      roles:['client']
    },
  ]

  return (

      <aside className="hidden  fixed top-16 lg:flex flex-col w-64 h-screen bg-white border-r border-gray-100 shadow-sm p-4">

      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-800">
          Best Loan Offers
        </h1>
        <p className="text-xs text-gray-400">
         
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.filter(item => item.roles.includes(role))
         .map((item, index) => {
          const isActive = location.pathname === item.path

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-green-50 text-green-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-500"
              }`}
            >
              <span className="text-lg">
                {item.icon}
              </span>
              <span className="text-sm">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            © 2026 Best Loan
          </p>
        </div>
      </div>

    </aside>

  )
}

export default SideBar