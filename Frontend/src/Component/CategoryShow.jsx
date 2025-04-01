import React from 'react'
import men1 from '../assets/Media/Men1.jpg';
import designer from '../assets/Media/18081.jpg';
import Cocktail from '../assets/Media/26873.jpg';
import Bespokemen from '../assets/Media/Bespokemen.jpg';


 
 

const collections = [
    {
      id: 1,
      image: [men1], // Replace with actual image URL
      title: "Wedding",
      subtitle: "COLLECTION",
    },
    {
      id: 2,
      image: [designer], // Replace with actual image URL
      title: "Designer",
      subtitle: "COLLECTION",
    },
    {
      id: 3,
      image: 
      [Cocktail], // Replace with actual image URL
      title: "Cocktail Party",
      subtitle: "COLLECTION",
    },
    {
      id: 4,
      image: [Bespokemen], // Replace with actual image URL
      title: "Bespoke’s Men",
      subtitle: "COLLECTION",
    },
  ];

function CategoryShow() {
    return (
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shop Our Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {collections.map((item) => (
              <div key={item.id} className="relative group">
                {/* Background Image */}
                <div className=' overflow-hidden inline-block '>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[450px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0  bg-opacity-0 rounded-lg flex flex-col items-center justify-end py-10   text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Button */}
          <div className="mt-8">
            <button className="border border-black px-6 py-2 text-black text-lg font-semibold rounded-lg hover:bg-black hover:text-white transition">
              Shop All Products
            </button>
          </div>
        </div>
      );
}

export default CategoryShow