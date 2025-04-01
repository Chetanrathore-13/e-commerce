import React from 'react'
import men1 from '../assets/Media/Men1.jpg'
import men2 from '../assets/Media/Men2.jpg'
import men3 from '../assets/Media/Men3.jpg'
import men4 from '../assets/Media/Men4.jpg'
import men5 from '../assets/Media/Men5.jpg'

function MenCollections() {
  return (
      <>
      {/* Second-hero  */}
      <div className='h-full w-full bg-white'>
        <h1 className='text-2xl text-center p-5'>Effortless Fashion, Ready to Ship!</h1>
        <div className="h-full w-full flex items-center justify-center p-5 gap-3">
          
          {/* Main Image */}
          <div className="w-1/2 relative rounded-lg overflow-hidden group">
            <img
              className="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
              src={men5}
              alt="Main"
            />
            <div className="absolute inset-0  bg-opacity-40 flex items-end justify-center pb-8 text-white text-lg font-semibold">
              Men's  
            </div>
          </div>
  
          {/* Grid Images */}
          <div className="w-1/2 grid grid-cols-2 gap-5">
            {[{ img: men1, text: " Wedding Outfit" }, { img: men2, text: " Wedding Kurta " }, { img: men3, text: "Wedding Sherwani " }, { img: men4, text: " Wedding Casuals" }].map((item, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden group">
                <img
                  className="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                  src={item.img}
                  alt={`Image ${index + 1}`}
                />
                <div className="absolute inset-0  bg-opacity-40 flex items-end justify-center pb-8 text-white text-sm font-semibold">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    )
}

export default MenCollections