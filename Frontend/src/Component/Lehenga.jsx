import React from 'react'
import leh1 from '../assets/Media/Lehen1.jpg'
import leh2 from '../assets/Media/Lehen 2.jpg'
import leh3 from '../assets/Media/Lehen 3.jpg'
import leh4 from '../assets/Media/Lehen 4.jpg'
import leh5 from '../assets/Media/Lehen5.jpg'

function Lehenga() {
 return (
     <>
     {/* Lehenga-section */}
     <div className='h-full w-full bg-white'>
       <h1 className='text-2xl text-center p-5'>Effortless Fashion, Ready to Ship!</h1>
       <div className="h-full w-full flex items-center justify-center p-5 gap-3">
         
        
 
         {/* Grid Images */}
         <div className="w-1/2 grid grid-cols-2 gap-5">
           {[{ img: leh5, text: "Bridal lehenga " }, { img: leh2, text: "New Arrivals lehengas" }, { img: leh3, text: "Designer Lehenga" }, { img: leh4, text: "Standard Lehenga " }].map((item, index) => (
             <div key={index} className="relative rounded-lg overflow-hidden group">
               <img
                 className="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                 src={item.img}
                 alt={`Image ${index + 1}`}
               />
               <div className="absolute inset-0  bg-opacity-40 flex items-end  justify-center text-white text-sm pb-8 font-semibold font-montserrat">
                 {item.text}
               </div>
             </div>
           ))}
         </div>

         {/* Main Image */}
         <div className="w-1/2 relative rounded-lg overflow-hidden group">
           <img
             className="w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
             src={leh1}
             alt="Main"
           />
           <div className="absolute inset-0  bg-opacity-40 flex items-end justify-center pb-8 text-white text-lg font-semibold">
              Lehenga 
           </div>
         </div>
       </div>
     </div>
     </>
   )
}

export default Lehenga