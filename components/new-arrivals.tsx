"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import AuthPopup from "./auth-popup";

interface Product {
  _id: string;
  name: string;
  slug: string;
  variations: Array<{
    _id: string;
    image: string;
    price: number;
    salePrice?: number;
    color: string;
    size: string;
  }>;
}

interface NewArrivalsProps {
  products: Product[];
  sectionImage?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function NewArrivals({
  products = [],
  sectionImage,
  sectionTitle = "New Arrivals",
  sectionSubtitle = "Check out our latest products",
}: NewArrivalsProps) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };
  const handleAuthPopupClose = () => {
    setShowAuthPopup(false);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [safeProducts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart logic here
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: string, variationId: string) => {
      e.preventDefault()
      e.stopPropagation()
  
      if (!session) {
        setShowAuthPopup(true)
        return
      }
  
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            variation_id: variationId,
          }),
        })
  
        if (!response.ok) {
          throw new Error("Failed to add to wishlist")
        }
  
        toast({
          title: "Success",
          description: "Added to wishlist",
        })
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to add to wishlist",
          variant: "destructive",
        })
      }
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
          }));
  
        
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 md:max-w-xl">
            <h2 className="text-5xl font-light mb-2 text-center text-teal-600">
              {sectionTitle}
            </h2>
            <p className="text-gray-600 text-start ml-2 pt-2">
              {sectionSubtitle}
            </p>
          </div>

          {sectionImage && (
            <div className="w-full md:w-1/3 lg:w-1/4 relative h-80 md:h-60">
              <Image
                src={sectionImage || "/placeholder.svg"}
                alt={sectionTitle || "New Arrivals"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        {showAuthPopup && <AuthPopup onClose={handleAuthPopupClose} />}
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-900 rounded-full p-2 shadow-md hover:bg-teal-700 text-white"
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
              const variation = product.variations[0];
              const discountPercentage = variation.salePrice
                ? Math.round(
                    ((variation.price - variation.salePrice) /
                      variation.price) *
                      100
                  )
                : 0;

              return (
                <Card
                  key={product._id}
                  className="min-w-[300px] max-w-[300px] max-h-[400px] min-h-[450px] flex-shrink-0 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  <div className="relative h-90 w-full group">
                    <Image
                      src={
                        variation.image ||
                        `/placeholder.svg?height=256&width=256&query=${product.name}`
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <button
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:cursor-pointer"
                       onClick={(e) => handleAddToWishlist(e, product._id, variation._id)}
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>
                    {/* {discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </div>
                    )} */}
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
                          <span className="font-bold text-teal-600">
                            ₹{variation.salePrice}
                          </span>
                          <span className="text-gray-500 line-through text-sm">
                            ₹{variation.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">₹{variation.price}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-900 rounded-full p-2 shadow-md text-white  hover:bg-teal-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-teal-600 rounded-md px-10 shadow-md hover:bg-teal-500  py-4  transition-colors text-md font-semibold text-white"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
