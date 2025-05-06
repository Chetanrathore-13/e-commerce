"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToCart, addToWishlist } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface ProductDetailClientProps {
  product: any
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariation, setSelectedVariation] = useState(product.variations?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(
    selectedVariation?.image || product.variations?.[0]?.image || "/placeholder.svg",
  )
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  // Helper function to fix image paths
  const fixImagePath = (path: string) => {
    if (!path) return "/diverse-products-still-life.png"

    // If it's already a full URL or starts with /, return as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, add /uploads/ prefix
    return `/uploads/${path}`
  }

  // Handle variation selection
  const handleVariationSelect = (variation: any) => {
    setSelectedVariation(variation)
    if (variation.image) {
      setSelectedImage(variation.image)
    }
  }

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (selectedVariation && newQuantity > selectedVariation.quantity) {
      toast({
        title: "Quantity limit",
        description: `Only ${selectedVariation.quantity} items available in stock.`,
        variant: "destructive",
      })
      return
    }
    setQuantity(newQuantity)
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!session) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedVariation) {
      toast({
        title: "Please select a variation",
        description: "You need to select a size and color before adding to cart",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingToCart(true)
      const response = await addToCart(product._id, selectedVariation._id, quantity)

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      // Refresh the page to update cart count
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    if (!session) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedVariation) {
      toast({
        title: "Please select a variation",
        description: "You need to select a size and color before adding to wishlist",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingToWishlist(true)
      const response = await addToWishlist(product._id, selectedVariation._id)

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  // Handle buy now
  const handleBuyNow = async () => {
    if (!session) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedVariation) {
      toast({
        title: "Please select a variation",
        description: "You need to select a size and color before checkout",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingToCart(true)
      const response = await addToCart(product._id, selectedVariation._id, quantity)

      if (response.error) {
        throw new Error(response.error)
      }

      // Redirect to checkout
      router.push("/checkout")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Get all available colors and sizes
  const availableColors = Array.from(new Set(product.variations?.map((v: any) => v.color))).filter(Boolean)
  const availableSizes = Array.from(new Set(product.variations?.map((v: any) => v.size))).filter(Boolean)

  // Get gallery images
  const galleryImages = selectedVariation?.gallery || []
  const allImages = [selectedVariation?.image, ...galleryImages].filter(Boolean)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={fixImagePath(selectedImage) || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                className={`relative h-24 bg-gray-100 rounded-lg overflow-hidden ${
                  selectedImage === image ? "ring-2 ring-teal-800" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={fixImagePath(image) || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center">
          <p className="text-2xl font-semibold text-teal-800">
            ₹{selectedVariation?.salePrice || selectedVariation?.price || 0}
          </p>
          {selectedVariation?.salePrice && (
            <p className="ml-2 text-lg text-gray-500 line-through">₹{selectedVariation.price}</p>
          )}
        </div>

        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>

        {/* Product Attributes */}
        <div className="space-y-4">
          {product.brand_id && (
            <div>
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-medium">{product.brand_id.name}</p>
            </div>
          )}
          {product.material && (
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="font-medium">{product.material}</p>
            </div>
          )}
        </div>

        {/* Color Selection */}
        {availableColors.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium">Color: {selectedVariation?.color}</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const colorVariation = product.variations.find((v: any) => v.color === color)
                return (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border ${
                      selectedVariation?.color === color ? "ring-2 ring-teal-800 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleVariationSelect(colorVariation)}
                    aria-label={`Select ${color} color`}
                  >
                    {selectedVariation?.color === color && <Check className="h-6 w-6 text-white mx-auto" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {availableSizes.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium">Size: {selectedVariation?.size}</p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const sizeVariation = product.variations.find(
                  (v: any) => v.size === size && v.color === selectedVariation?.color,
                )
                const isAvailable = !!sizeVariation
                return (
                  <button
                    key={size}
                    className={`h-10 min-w-[2.5rem] px-3 rounded border ${
                      selectedVariation?.size === size
                        ? "bg-teal-800 text-white"
                        : isAvailable
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && handleVariationSelect(sizeVariation)}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <p className="font-medium">Quantity</p>
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 flex items-center justify-center border rounded-md"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              className="w-8 h-8 flex items-center justify-center border rounded-md"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={selectedVariation && quantity >= selectedVariation.quantity}
            >
              +
            </button>
            {selectedVariation && (
              <span className="text-sm text-gray-500 ml-2">{selectedVariation.quantity} available</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            className="flex-1 bg-teal-800 hover:bg-teal-900"
            onClick={handleBuyNow}
            disabled={isAddingToCart || !selectedVariation}
          >
            Buy Now
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariation}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist || !selectedVariation}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Status */}
        {selectedVariation && (
          <div className="text-sm">
            {selectedVariation.quantity > 0 ? (
              <p className="text-green-600">In Stock</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
