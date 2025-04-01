import React from 'react'
import original from '../assets/Media/100.png'
import price from '../assets/Media/Price.png'
import ship from '../assets/Media/Ship.png'

function Footer2() {
  return (
    <>
    {/* Features Section */}
    <div className="bg-[#F6F8F9] py-15  grid grid-cols-3 gap-6 px-14">
        {/* Feature 1 */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
          <img src={ship} alt="Quality" className="w-8 h-8" />
            <h3 className="font-semibold">90% Ready To Ship</h3>
          </div>
          <p className="text-md font-montserrat  leading-[4vh] text-gray-600 mt-2">
            We impart assurance on worldwide delivery and 90% of the merchandise are ready to ship.
            Once the order is placed from your end, the product will be delivered to your doorstep within 3-4 business days.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <img src={original} alt="Quality" className="w-8 h-8" />
            <h3 className="font-semibold">100% Original Quality</h3>
          </div>
          <p className="text-md font-montserrat  leading-[4vh] text-gray-600 mt-2">
            Quality assurance of our product is highly uncompromisable as we offer 100% genuine quality,
            ensuring our products and services meet your expectations.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <img src={price} alt="Price" className="w-8 h-8" />
            <h3 className="font-semibold">Best Price Challenge</h3>
          </div>
          <p className="text-md font-montserrat  leading-[4vh] text-gray-600 mt-2">
            The prices offered here are cost-effective and best suited for your purchase,
            making your shopping experience hassle-free and convenient from the comfort of your couch.
          </p>
        </div>
      </div>
    
    </>
  )
}

export default Footer2