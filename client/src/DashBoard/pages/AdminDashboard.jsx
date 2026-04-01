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
        <div className='grid grid-cols md:grid-cols lg:grid-cols-3  gap-2 my-2'>
          <div className='bg-white p-3 rounded-2xl shadow-sm grid grid-cols justify-center border border-gray-100'>
            <p className="text-sm text-gray-500 font-semibold">Total Amount Issued</p>
            <h2 className="text-xl font-bold text-green-600 mt-1">12800</h2>
          </div>
        </div>
         <div className=' grid grid-cols-2 justify-between gap-2 my-2'>
               <div className='bg-white p-3 rounded-2xl shadow-sm grid  justify-between  border border-gray-100'>
               <p className="text-sm text-gray-500 font-semibold">Total Amount Repaid</p>
               <h2 className="text-xl font-bold text-green-600 mt-1">12800</h2>
               </div>
            <div className='bg-white p-3 rounded-2xl shadow-sm grid  justify-between  border border-gray-100'>
               <p className="text-sm text-gray-500 font-semibold">Total Amount </p>
               <h2 className="text-xl font-bold text-green-600 mt-1">12800</h2>

            </div>

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