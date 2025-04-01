import React from 'react'

import ted1 from '../assets/Media/Tred1.jpg'
import ted2 from '../assets/Media/Tred2.jpg'
import ted3 from '../assets/Media/Tred3.jpg'
import ted4 from '../assets/Media/Tred4.jpg'
import leh4 from '../assets/Media/Lehen 4.jpg'

const products = [
    {
      "id": 1,
      "image": [ted1],
      "title": "Multicolor Printed Georgette Saree - SR27383",
      "price": "₹ 23000"
    },
    {
      "id": 2,
      "image": [ted2],
      "title": "Beaver Fur Brown Sequins Embroidered Net Saree - SR27384",
      "price": "₹ 5000"
    },
    {
      "id": 3,
      "image": [ted3],
      "title": "Blue Gathered Style Georgette Lehenga With Embroidered Jacket - GC4585",
      "price": "₹ 31000"
    },
    {
      "id": 4,
      "image": [ted4],
      "title": "Blue Gathered Style Georgette Sangeet Lehenga With Embroidered Blouse",
      "price": "₹ 25232"
    },
    {
      "id": 5,
      "image": [leh4],
      "title": "Purple Umbrella Style Net Sangeet Lehenga With Embroidered Blouse",
      "price": "₹ 34150"
    }
  ];

function Trending() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-2xl text-center p-5 ">Trend Alert</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((item) => (
              <div key={item.id} className="text-center">
                {/* Product Image */}
                <div className="relative">
                  <div className=" overflow-hidden inline-block">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  />
                  </div>
                  <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl">
                    ♡
                  </button>
                </div>
                {/* Product Info */}
                <h3 className="text-sm leading-4 font-medium mt-3 text-gray-700 text-start">{item.title}</h3>
                <p className="text-sm leading-6 font-semibold text-gray-900 text-start  ">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      );
}

export default Trending