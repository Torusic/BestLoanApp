import React from 'react'
import Footer from '../component/Footer'
import { Outlet } from 'react-router-dom'
import Header from '../component/Header.jsx';
import SideBar from '../component/SideBar.jsx';

const AdminStats = () => {
  return (
    <section className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex flex-1">
        <div className="hidden lg:block w-64">
          <SideBar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
      <div className="block lg:hidden sticky bottom-0">
        <Footer />
      </div>

    </section>
  );
};

export default AdminStats;