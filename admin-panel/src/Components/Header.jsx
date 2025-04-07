import React from 'react'
import logo from '../assets/Logo/Sitelogo2.jpg'

function Header() {
  return (
    <div  className=' flex items-center justify-between px-10 py-4 '>
    <img className=' h-16 w-22 object-cover' src={logo} alt="" />
    <hr  />
    <button className=' font-montserrat border border-gray-500 px-4 py-2 rounded-full '>Logout</button>
    </div>
  )
}

export default Header   