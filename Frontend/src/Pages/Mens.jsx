import React from 'react'

import men5 from '../assets/Media/Men5.jpg'
import men1 from '../assets/Media/Men1.jpg'
import men2 from '../assets/Media/Men2.jpg'
import men3 from '../assets/Media/Men3.jpg'
import men4 from '../assets/Media/Men4.jpg'

const products = [
  {
    id: 1,
    image: [men5],
    title: "Sage Green Resham Embroidered Silk Jodhpuri Suit",
    price: "₹37,250",
    orderType: "Pre Order",
  },
  {
    id: 2,
    image: [men1],
    title: "Black Resham Embroidered Velvet Jodhpuri Suit",
    price: "₹28,490",
    orderType: "Pre Order",
  },
  {
    id: 3,
    image: [men3],
    title: "Navy Blue Silk Resham Embroidered Indowestern Sherwani",
    price: "₹34,600",
    orderType: "Pre Order",
  },
  {
    id: 4,
    image: [men4],
    title: "Black Silk Resham Embroidered Indowestern Sherwani",
    price: "₹34,600",
    orderType: "Pre Order",
  },
  {
    id: 4,
    image: [men2],
    title: "Black Silk Resham Embroidered Indowestern Sherwani",
    price: "₹34,600",
    orderType: "Pre Order",
  },
];

const Filters = () => {
  return (
    <div className="w-full md:w-1/4 p-4 ">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="border-b border-gray-300 pb-4">
        <h3 className="text-md font-medium">Price</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Categories</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Color</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Embellishment</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Fabric</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Purity</h3>
      </div>
      <div className="border-b pb-4 mt-4">
        <h3 className="text-md font-medium">Shipping</h3>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  return (
    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="border border-none rounded-lg overflow-hidden ">
          <img src={product.image} alt={product.title} className="w-full h-80 object-cover" />
          <div className="p-4 text-start">
            <h3 className="text-[1.8vh] font-medium leading-4 ">{product.title}</h3>
            <p className="text-gray-700 text-sm">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <nav className="text-sm text-gray-500">Home / What's New / Mens</nav>
        <div className="text-sm font-medium">Sort By: <span className="text-gray-700">Trending</span></div>
      </div>
      <div className="flex flex-col md:flex-row">
        <Filters />
        <ProductGrid />
      </div>
    </div>
  );
};

export default ProductPage;
