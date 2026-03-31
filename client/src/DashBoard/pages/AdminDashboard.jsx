import React from 'react'
import Footer from '../../component/Footer'
import { IoIosPersonAdd } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { FaHistory } from 'react-icons/fa';

const AdminDashboard = () => {


  return (
    <section className="min-h-screen bg-gray-50 p-4 lg:p-8">
      
      <div className=" w-full">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of system performance and loan activity
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* CARD */}
          <div className="bg-white p-3 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100">
            <div className='grid items-center'>
            <p className="text-sm text-gray-500">Total Clients</p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">128</h2>
            </div>
            <IoIosPersonAdd  className='text-green-400' />
            
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Agents</p>
            <h2 className="text-xl font-bold text-green-500 mt-1">8</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Loans Approved</p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">18</h2>

            </div>
            
            <FcApproval />
          </div>

          

          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Loans Pending</p>
            <h2 className="text-xl font-bold text-yellow-500 mt-1">9</h2>
            </div>

            <FaHistory className='text-yellow-400'/>
          </div>

        </div>

        {/* EXTRA SECTION (Optional SaaS feel) */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            System Summary
          </h3>

          <div className="flex lg:flex-cols-4 md:flex-cols-3 justify-between  gap-2">
            <div className="bg-gray-50 p-4  rounded-xl">
              <p className="text-xs text-gray-500">Active Loans</p>
              <p className="text-sm font-bold text-gray-800">17</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Fees Pending</p>
              <p className="text-sm font-bold text-red-500">3</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Fees Verified </p>
              <p className="text-xs font-bold text-green-600">3</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
  
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Agent Performance
  </h3>

  <table className="min-w-full text-xs text-left">
    
    
    <thead className="bg-gray-50 text-gray-600  text-xs">
      <tr>
        <th className="px-4 py-3 text-xs">Agent Name</th>
        <th className="px-4 py-3">Total Loans</th>
        <th className="px-4 py-3">Amount Issued</th>
        
      </tr>
    </thead>

   
    <tbody >
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 font-medium text-gray-800">John Doe</td>
        <td className="px-4 py-3">12</td>
        <td className="px-4 py-3 text-green-600">KES 45,000</td>
       
      </tr>

      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 font-medium text-gray-800">Jane Smith</td>
        <td className="px-4 py-3">8</td>
        <td className="px-4 py-3 text-green-600">KES 30,000</td>
        
      </tr>
    </tbody>

  </table>
</div>



      </div>

      
    </section>
  )
}

export default AdminDashboard