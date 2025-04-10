import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

const Dashboard = () => {
  return (
    <>
    <Header/>
    <hr/>
    <div className="flex h-screen w-[20%] bg-gray-100 border-r-2">
      {/* Sidebar */}
      <div className="w-full bg-white shadow-md">
        <Sidebar />

        <div className=" w-[80%] mx-auto ml-[max(5vw , 25px)] my-8 text-gray-600">
          <Outlet />
        </div>
      </div>

      {/* Main Content */}
      
    </div>
    </>
    
  );
};

export default Dashboard;
