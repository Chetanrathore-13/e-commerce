import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";


const Dashboard = () => {
  return (
    <>
      <Header />
      <hr />
      
      {/* Main Layout: Sidebar + Main Content */}
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <div className="w-[20%] bg-white shadow-md border-r">
          <Sidebar />
         
        </div>

        {/* Main Content Area */}
        <div className="w-[80%] p-6 overflow-y-auto ">
         
         <Outlet />
        </div>
        
      </div>
    </>
  );
};

export default Dashboard;
