import React from 'react'
import { useDispatch } from 'react-redux'
import logo from '../assets/Logo/Sitelogo2.jpg'
import { logout } from '../features/auth/authSlice'

function Header() {
  const dispatch = useDispatch()

  return (
    <div  className=' flex items-center justify-between px-10 py-4 '>
    <img className=' h-16 w-22 object-cover' src={logo} alt="" />
    <hr  />
    <button onClick={() => dispatch(logout())} className=' bg-[#caaf7a] hover:bg-[#cfc1a4c4] px-5 py-3 font-montserrat rounded-full'>Logout</button>
    </div>
  )
}

export default Header   