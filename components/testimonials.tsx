"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getTestimonialsData
} from "@/lib/api";

interface Testimonial {
  _id: string
  name: string
  role?: string
  image?: string
  content: string
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
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [testimonialsData, setTestimonials] = useState<Testimonial[]>([])

  // Ensure testimonials is always an array
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : []
  useEffect(() => {
    const testimonialrealdata = async () => {
      try {
        const data = await getTestimonialsData()
        setTestimonials(data.testimonials)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      }
    }
    testimonialrealdata()
  },[])

  // If no testimonials are provided, use default ones
  const displayTestimonials =
    safeTestimonials.length > 0
      ? safeTestimonials
      : testimonialsData

  // Calculate the number of pairs
  const pairCount = Math.ceil(displayTestimonials.length / 2)

  const nextTestimonial = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentPairIndex((prevIndex) => (prevIndex + 1) % pairCount)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const prevTestimonial = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentPairIndex((prevIndex) => (prevIndex - 1 + pairCount) % pairCount)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-5xl font-light mb-2 text-center">{sectionTitle}</h2>
              <p className="text-gray-600 text-start mt-2 pt-2">{sectionSubtitle}</p>
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
        )}

        {/* Testimonial carousel */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out w-full ${isTransitioning ? "opacity-70" : "opacity-100"}`}
              style={{ transform: `translateX(-${currentPairIndex * 100}%)` }}
            >
              {/* Create pairs of testimonials */}
              {Array.from({ length: pairCount }).map((_, pairIndex) => (
                <div key={pairIndex} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* First testimonial in pair */}
                    {pairIndex * 2 < displayTestimonials.length && (
                      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="w-full md:w-2/5 h-[400px] relative">
                            <Image
                              src={
                                displayTestimonials[pairIndex * 2].image ||
                                "/placeholder.svg?height=400&width=300&query=person"
                              }
                              alt={`Testimonial by ${displayTestimonials[pairIndex * 2].name}`}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                            <p className="text-gray-700 italic mb-6">{displayTestimonials[pairIndex * 2].content}</p>
                            <div>
                              <p className="font-medium text-center">{displayTestimonials[pairIndex * 2].name}</p>
                              <p className="text-gray-500 text-center text-sm mb-4">
                                {displayTestimonials[pairIndex * 2].role}
                              </p>
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  className="rounded-none border-gray-300 hover:bg-transparent hover:text-black"
                                >
                                  VIEW PRODUCT
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Second testimonial in pair */}
                    {pairIndex * 2 + 1 < displayTestimonials.length && (
                      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="w-full md:w-2/5 h-[400px] relative">
                            <Image
                              src={
                                displayTestimonials[pairIndex * 2 + 1].image ||
                                "/placeholder.svg?height=400&width=300&query=person"
                              }
                              alt={`Testimonial by ${displayTestimonials[pairIndex * 2 + 1].name}`}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                            <p className="text-gray-700 italic mb-6 text-right">
                              {displayTestimonials[pairIndex * 2 + 1].content}
                            </p>
                            <div>
                              <p className="font-medium text-center">{displayTestimonials[pairIndex * 2 + 1].name}</p>
                              <p className="text-gray-500 text-center text-sm mb-4">
                                {displayTestimonials[pairIndex * 2 + 1].role}
                              </p>
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  className="rounded-none border-gray-300 hover:bg-transparent hover:text-black"
                                >
                                  VIEW PRODUCT
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {displayTestimonials.length > 2 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Previous testimonials"
                disabled={isTransitioning}
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Next testimonials"
                disabled={isTransitioning}
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Pagination dots */}
        {pairCount > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: pairCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setCurrentPairIndex(index)
                  setTimeout(() => setIsTransitioning(false), 500)
                }}
                className={`h-2 w-2 rounded-full ${index === currentPairIndex ? "bg-gray-800" : "bg-gray-300"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
