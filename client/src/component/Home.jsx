import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      
      <div className="max-w-6xl w-full px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-semibold text-green-600 tracking-wide uppercase">
            Welcome to Best Loan Offers
          </p>
          

          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Smart Loans. <br />
            <span className="text-green-500">Better Opportunities.</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
            Best Loan Offers is a simple and secure platform for applying,
            managing, and tracking loans—built to make lending fast,
            transparent, and easy for clients, agents, and admins.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-md transition">
              <Link to={'/register'}>Get Started</Link>
            </button>

            <button className="px-6 py-3 border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 rounded-xl font-semibold transition">
              <Link to={'/login'}>Login</Link>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (CARD / MOCK DASHBOARD) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-gray-800 font-semibold mb-4">
            Dashboard Overview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-xl font-bold text-gray-800">1,250</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Loans Approved</p>
              <p className="text-xl font-bold text-green-500">680</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-500">145</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-xl font-bold text-red-500">75</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Home