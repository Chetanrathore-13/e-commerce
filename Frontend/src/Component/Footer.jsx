import React from 'react'
import "remixicon/fonts/remixicon.css";
import Instagram  from "../assets/icon/instagram.png";
import Facebook from "../assets/icon/Facebook.png"
import Pinterest from "../assets/icon/Pinterest.png"
import Whatsapp from "../assets/icon/whatsapp.png"
import sitelogo from '../assets/Media/sitelogo2.jpg'

// import { FaFacebookF, FaInstagram, FaPinterestP, FaWhatsapp } from "react-icons/fa";
// import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";

function Footer() {
  return (
    <footer className="bg-[#ad874671]  text-black  px-5 py-20  text-sm w-full flex items-center justify-around">
    <div className="container mx-auto flex items-center justify-around gap-6 px-5 py-5">
      {/* Shop Now */}
      <div className="">
        <img className='h-44 w-44 mix-blend-color-burn'  src={sitelogo} alt="" />
        
      </div>

      {/* Useful Links */}
      <div className="space-y-2">
        <h2 className="font-semibold text-3xl">Quicks Links</h2>
        <ul className="space-y-4 text-[1.3vw]">
          <li className="hover:text-gray-400 cursor-pointer">Blog</li>
          <li className="hover:text-gray-400 cursor-pointer">FAQ’s</li>
          <li className="hover:text-gray-400 cursor-pointer">About Us</li>
          <li className="hover:text-gray-400 cursor-pointer">Contact Us</li>
          <li className="hover:text-gray-400 cursor-pointer">Men’s Wear</li>
        </ul>
      </div>

       {/* Useful Links */}
       <div className="space-y-2">
        <h2 className="font-semibold text-3xl">Policy</h2>
        <ul className="space-y-4 text-[1.3vw] ">
          <li className="hover:text-gray-400 cursor-pointer">Track Order </li>
          <li className="hover:text-gray-400 cursor-pointer">Refund policy </li>
          <li className="hover:text-gray-400 cursor-pointer">Terms & Conditions</li>
          <li className="hover:text-gray-400 cursor-pointer">Privacy Policy</li>
          <li className="hover:text-gray-400 cursor-pointer">Shipping & Returns</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h2 className="font-semibold text-3xl">Contact Us</h2>
        <p className='text-[1.3vw]' >Samyakk, Bangalore – 560047, India</p>
        <p className='text-[1.3vw]'>+91-7829928490</p>
        <p className='text-[1.3vw]'>esales@samyakk.com</p>
        <div className="flex space-x-4 mt-2 text-lg">
          <img className='h-10 w-10' src={Instagram} alt="" />
          <img className='h-10 w-10' src={Facebook} alt="" />
          <img className='h-10 w-10' src={Pinterest} alt="" />
          <img className='h-10 w-10' src={Whatsapp} alt="" />
          
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer