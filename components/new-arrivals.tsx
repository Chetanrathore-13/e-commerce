"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  slug: string
  variations: Array<{
    _id: string
    image: string
    price: number
    salePrice?: number
    color: string
    size: string
  }>
}

interface NewArrivalsProps {
  products: Product[]
  sectionImage?: string
  sectionTitle?: string
  sectionSubtitle?: string
}

export default function NewArrivals({
  products = [],
  sectionImage,
  sectionTitle = "New Arrivals",
  sectionSubtitle = "Check out our latest products",
}: NewArrivalsProps) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : []
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      checkScrollButtons()
      scrollContainer.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [safeProducts])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    // Add to cart logic here
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    // Add to wishlist logic here
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  // If no products are provided, use default ones
  const displayProducts =
    safeProducts.length > 0
      ? safeProducts
      : Array(8)
          .fill(null)
          .map((_, i) => ({
            _id: `default-${i}`,
            name: `Product ${i + 1}`,
            slug: `product-${i + 1}`,
            variations: [
              {
                _id: `var-${i}`,
                image: "/elegant-evening-gown.png",
                price: 1999 + i * 100,
                salePrice: i % 3 === 0 ? 1799 + i * 100 : undefined,
                color: "Black",
                size: "M",
              },
            ],
          }))

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 md:max-w-xl">
            <h2 className="text-5xl font-light mb-2 text-center">{sectionTitle}</h2>
            <p className="text-gray-600 text-start ml-2 pt-2">{sectionSubtitle}</p>
          </div>

          {sectionImage && (
            <div className="w-full md:w-1/3 lg:w-1/4 relative h-40 md:h-60">
              <Image
                src={sectionImage || "/placeholder.svg"}
                alt={sectionTitle || "New Arrivals"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayProducts.map((product) => {
              const variation = product.variations[0]
              const discountPercentage = variation.salePrice
                ? Math.round(((variation.price - variation.salePrice) / variation.price) * 100)
                : 0

              return (
                <Card
                  key={product._id}
                  className="min-w-[300px] max-w-[300px] max-h-[400px] min-h-[450px] flex-shrink-0 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  <div className="relative h-80 w-full group">
                    <Image
                      src={variation.image || `/placeholder.svg?height=256&width=256&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-fill transition-transform group-hover:scale-105 duration-500"
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex justify-center gap-2 py-3 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" /> Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-white"
                        onClick={(e) => handleAddToWishlist(e, product)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div> */}
                  </div>
                  <CardContent className="p-5 ">
                    <h3 className=" text-xl mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {variation.salePrice ? (
                        <>
                          <span className="font-bold">₹{variation.salePrice}</span>
                          <span className="text-gray-500 line-through text-sm">₹{variation.price}</span>
                        </>
                      ) : (
                        <span className="font-bold">₹{variation.price}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/products">
            <Button variant="outline" className="rounded-md">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
