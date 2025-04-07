import React, { useState } from "react";

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      {/* Upload Images */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Upload Image</label>
        <div className="flex gap-4">
          {images.map((img, i) => (
            <label
              key={i}
              className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md cursor-pointer overflow-hidden relative"
            >
              {img ? (
                <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-gray-500">Upload</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageChange(e, i)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Product name</label>
        <input
          type="text"
          placeholder="Type here"
          className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Product Description */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Product description</label>
        <textarea
          placeholder="Write content here"
          className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        ></textarea>
      </div>

      {/* Category & Price */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block font-medium mb-1">Product category</label>
          <select className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-medium mb-1">Sub category</label>
          <select className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Footwear</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-medium mb-1">Product Price</label>
          <input
            type="number"
            placeholder="25"
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Product Sizes</label>
        <div className="flex gap-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div
              key={size}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Add to bestseller</span>
        </label>
      </div>

      {/* Submit Button */}
      <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
        ADD
      </button>
    </div>
  );
};

export default Add;
