import React from 'react'
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { CalendarArrowUp } from 'lucide-react';


function Sidebar() {
  return (
    <div className=' w-[18%] min-h-screen border-r-1'>
        <div className=' flex flex-col items-center  gap-4 pt-6 pl-[18%] text-[15px]'>
            <NavLink className=' flex items-center justify-center gap-3 border px-3 py-2 border-gray-300 ' to='/add'>
              <Plus/>
              <p>Add items</p>
            </NavLink>
            <NavLink className=' flex items-center justify-center gap-3 border px-3 py-2 border-gray-300 ' to='/Items'>
              <CalendarArrowUp/>
              <p>List items </p>
            </NavLink>
            <NavLink className=' flex items-center justify-center gap-3 border px-3 py-2 border-gray-300 ' to='/Order'>
             <CalendarArrowUp/>
              <p>Orders</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar