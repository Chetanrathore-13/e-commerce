"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  _id: string
  name: string
  role?: string
  image?: string
  rating: number
  text: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  sectionImage?: string
  sectionTitle?: string
  sectionSubtitle?: string
}

export default function Testimonials({
  testimonials = [],
  sectionImage,
  sectionTitle = "What Our Customers Say",
  sectionSubtitle = "Read testimonials from our satisfied customers",
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Ensure testimonials is always an array
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : []

  // If no testimonials are provided, use default ones
  const displayTestimonials =
    safeTestimonials.length > 0
      ? safeTestimonials
      : [
          {
            _id: "1",
            name: "Priya Sharma",
            role: "Fashion Blogger",
            image: "/indian-woman-portrait.png",
            rating: 5,
            text: "The quality of the fabrics and the attention to detail in the stitching is exceptional. I've received countless compliments on my outfits from this store.",
          },
          {
            _id: "2",
            name: "Rahul Verma",
            role: "Wedding Planner",
            image: "/indian-man-portrait.png",
            rating: 5,
            text: "I recommend this store to all my clients for their wedding shopping. The collection is exquisite and the customer service is outstanding.",
          },
          {
            _id: "3",
            name: "Ananya Patel",
            role: "Customer",
            image: "/indian-woman-portrait.png",
            rating: 4,
            text: "I ordered a lehenga for my sister's wedding and it arrived exactly as pictured. The quality was great and the delivery was prompt.",
          },
        ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 md:max-w-xl">
            <h2 className="text-3xl font-bold mb-4">{sectionTitle}</h2>
            <p className="text-gray-600">{sectionSubtitle}</p>
          </div>

          {sectionImage && (
            <div className="w-full md:w-1/3 lg:w-1/4 relative h-40 md:h-60">
              <Image
                src={sectionImage || "/placeholder.svg"}
                alt={sectionTitle || "Testimonials"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayTestimonials.map((testimonial) => (
                <div key={testimonial._id} className="w-full flex-shrink-0">
                  <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4 md:mb-0 flex-shrink-0">
                          <Image
                            src={testimonial.image || `/placeholder.svg?height=96&width=96&query=person`}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            {testimonial.role && <p className="text-gray-500 text-sm">{testimonial.role}</p>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {displayTestimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Testimonial Indicators */}
        {displayTestimonials.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-amber-500" : "bg-gray-300"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
