import React from "react";
import prodImg1 from '../assets/Media/1046.jpg';
import prodImg2 from '../assets/Media/2.jpg';
import prodImg3 from '../assets/Media/3223.jpg';
import prodImg4 from '../assets/Media/7787973.jpg';
import prodImg5 from '../assets/Media/1.png';


const products = [
  {
    id: 1,
    image: [prodImg1], // Fixed image reference
    title: "Cream & Pink Ombre Sequins Embroidered Georgette Anarkali Salwar",
    price: "₹ 23,390",
  },
  {
    id: 2,
    image: [prodImg2],
    title: "Prussian Blue Organza Sequins Work Indowestern Lehenga With Heavy",
    price: "₹ 35,690",
  },
  {
    id: 3,
    image: [prodImg3],
    title: "Dark Navy Blue Organza Resham Work Indowestern Lehenga With Heavy",
    price: "₹ 35,690",
  },
  {
    id: 4,
    image: [prodImg4],
    title: "Sage Green Umbrella Style Tissue Mehendi Lehenga With Jewel Neck",
    price: "₹ 20,990",
  },
  {
    id: 5,
    image: [prodImg5],
    title: "Prussian Blue Umbrella Style Crepe Bridesmaids Lehenga With Sweet Heart",
    price: "₹ 33,590",
  },
];

function LehengaCollection() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-2xl text-center p-5 ">New Arrivals</h1>
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
            <h3 className="text-sm leading-4 font-medium mt-3 text-gray-700 text-start font-montserrat">{item.title}</h3>
            <p className="text-sm leading-6 font-semibold text-gray-900 text-start  ">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LehengaCollection;
