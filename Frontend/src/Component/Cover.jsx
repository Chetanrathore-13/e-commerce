import React from 'react'

function Cover() {
  return (
    <div className="bg-[#F6F8F9] flex items-center justify-around  py-8 px-8">
    {/* Newsletter Subscription */}
    <div className="text-center    flex items-center justify-around gap-80 ">
      <h2 className="text-lg font-medium w-100 text-start leading-6.5">
        Many things are happening, Get the latest news & updates. Subscribe to our Newsletter!
      </h2>
      <div className="mt-4 flex justify-center">
        <input
          type="email"
          placeholder="Enter Email Address"
          className="border border-gray-400 px-4 py-2 rounded-l-md w-80 focus:outline-none"
        />
        <button className="bg-[#4E5258] text-white px-6 py-2 rounded-r-md hover:bg-[#AD8746] transition-all ease-in-out">
          Subscribe Now
        </button>
      </div>
    </div>
    </div>
  )
}

export default Cover