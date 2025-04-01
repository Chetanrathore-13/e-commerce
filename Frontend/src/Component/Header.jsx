import React from 'react'
import "remixicon/fonts/remixicon.css";
import Sitelogo2 from "../assets/Media/Sitelogo2.jpg";
import { Link , NavLink } from "react-router";

function Header() {
    
  return (
    <>
    <nav className="font-montserrat bg-white shadow-md p-4">
      {/* Top Navigation */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Category Tabs */}
        <div className="flex space-x-6">
         <NavLink to='/'  className={({ isActive }) =>
              `px-4 py-2 rounded-md text-black ${
                isActive ? "bg-[#B08E5B] text-white " : "hover:bg-[#b08e5ba1] text-black "
              }`
            }> 
            Home
         </NavLink>
         <NavLink to='/Mens'  className={({ isActive }) =>
              `px-4 py-2 rounded-md text-black ${
                isActive ? "bg-[#B08E5B] text-white" : "hover:bg-[#b08e5ba1] text-black "
              }`
            }> 
            Mens
         </NavLink>
        </div>
        
        {/* Logo */}
        <div className="text-xl font-bold text-[#B08E5B]">
          <img className='w-14 h-14' src={Sitelogo2} alt=''/>
        </div>
        
        {/* Icons */}
        <div className="flex space-x-4 text-gray-700 text-[1.5vw] font-medium">
          <span className='text-[1.5vw] font-medium'>INR</span>
          <i class="ri-vidicon-line font-medium"></i>
          <i class="ri-whatsapp-line font-medium"></i>
          <i class="ri-search-line font-medium"></i>
          <i class="ri-heart-line font-medium"></i>
          <i class="ri-user-line font-medium"></i>
          <i class="ri-handbag-line font-medium"></i>
          
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 mt-2">
        <div className="container mx-auto flex justify-center space-x-6 py-2 text-gray-700 text-sm">
          <span>WHAT'S NEW</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>SAREES</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>SALWAR KAMEEZ</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>LEHENGA</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>GOWNS</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>MEN'S WEAR</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>COLLECTION</span>
          <span className="text-[#E5D4C3]">◆</span>
          <span>INSTASHOP</span>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Header