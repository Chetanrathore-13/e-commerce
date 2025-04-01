import React from 'react'
import img1 from "../assets/Media/Sar1.jpg"
import img2 from "../assets/Media/Sar2.jpg"
import img3 from "../assets/Media/Sar3.jpg"
import img4 from "../assets/Media/Sar4.jpg"
import img5 from "../assets/Media/Sar5.jpg"


function Hero2() {
  return (
    <>
    {/* Second-hero  */}
    <div className='h-full w-full bg-white'>
      <h1 className='text-2xl text-center p-5 font-montserrat'>Effortless Fashion, Ready to Ship!</h1>
      <div className="h-full w-full flex items-center justify-center p-5 gap-3">
        
        {/* Main Image */}
        <div className="w-1/2 relative rounded-lg overflow-hidden group">
          <img
            className="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
            src={img5}
            alt="Main"
          />
          <div className="absolute inset-0  bg-opacity-40 flex items-end justify-center pb-8 text-white text-lg font-semibold">
           Banarasi Saree
          </div>
        </div>

        {/* Grid Images */}
        <div className="w-1/2 grid grid-cols-2 gap-5">
          {[{ img: img1, text: "Designer Saree" }, { img: img2, text: "Kanchipuram Saree" }, { img: img3, text: "Ready blouse Saree " }, { img: img4, text: " Top Notch Saree" }].map((item, index) => (
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

export default Hero2
