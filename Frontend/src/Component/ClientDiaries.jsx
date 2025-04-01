import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import test1 from '../assets/Media/Testi1.jpg'
import test2 from '../assets/Media/Testi2.jpg'
import test3  from '../assets/Media/Testi3.jpg'
import test4 from '../assets/Media/Testi4.jpg'


const testimonials = [
  {
    image: [test1], // Replace with actual image URL
    quote:
      "Absolutely thrilled with my purchase from Samyakk! The lehenga looked straight out of a fairytale and fit perfectly.",
    name: "Shivani Pal",
    country: "INDIA",
  },
  {
    image: [test2], // Replace with actual image URL
    quote:
      "The customer service at Samyakk is unmatched! My saree arrived on time, and it’s gorgeous. The attention to detail is amazing!",
    name: "Shivani Agarwal",
    country: "INDIA",
  },
  {
    image: [test3], // Replace with actual image URL
    quote:
      "I ordered a designer outfit, and it exceeded my expectations. The fabric quality, embroidery, and fit were just perfect!",
    name: "Ritika Sharma",
    country: "USA",
  },
  {
    image: [test4], // Replace with actual image URL
    quote:
      "Shopping with Samyakk was an amazing experience! The collection is stunning, and customer service was top-notch!",
    name: "Anjali Verma",
    country: "UK",
  },
];

function ClientDiaries() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [index]);

  const prevTestimonial = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#CEC0A3] py-14 px-5">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white ">Client Testimonial</h2>
      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 md:left-5 text-white hover:text-gray-900"
        >
          <FaChevronLeft size={30} />
        </button>

        {/* Testimonial Box with Animation */}
        <div className="relative max-w-3xl max-h-5xl mx-auto bg-white rounded-lg shadow-lg p-6 test">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-5"
            >
              <img
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-40 h-40 md:w-32 md:h-32 object-cover rounded-md"
              />
              <div className="text-center md:text-left">
                <p className=" italic">"{testimonials[index].quote}"</p>
                <h3 className="mt-4 font-semibold text-lg text-gray-800">{testimonials[index].name}</h3>
                <p className="text-yellow-600 text-sm">{testimonials[index].country}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextTestimonial}
          className="absolute right-10 md:right-5 text-white hover:text-gray-900"
        >
          <FaChevronRight size={30} />
        </button>
      </div>
    </div>
  );
}

export default ClientDiaries;
