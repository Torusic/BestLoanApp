import React from 'react'
import { Outlet } from 'react-router-dom';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import Footer from '../component/Footer';

function AgentStats() {
   return (
    <section className="min-h-screen flex flex-col">
      <Header/>
      <div className="flex flex-1">
        <div className="hidden lg:block w-64">
          <SideBar />
        </div>
        <div className="flex-1 p-2  overflow-y-auto scrollbar-hidden h-full">
          <Outlet />
        </div>
      </div>
      <div className="block lg:hidden sticky bottom-0">
        <Footer />
      </div>

    </section>
  );
};

export default AgentStats