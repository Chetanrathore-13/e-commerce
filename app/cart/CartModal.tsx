"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { state: cartState, updateCartItem, removeFromCart } = useCart()
  const { addToWishlist } = useWishlist()
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Set loading to false after a short delay
      const timer = setTimeout(() => {
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string, productName: string) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "Item removed",
        description: `${productName} removed from cart`,
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const moveToWishlist = async (productId: string, variationId: string, cartItemId: string, productName: string) => {
    try {
      await addToWishlist(productId, variationId)
      await removeFromCart(cartItemId)
      toast({
        title: "Moved to wishlist",
        description: `${productName} moved to wishlist`,
      })
    } catch (error) {
      console.error("Error moving to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to move item to wishlist",
        variant: "destructive",
      })
    }
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive",
      })
      return
    }

    setApplyingCoupon(true)
    try {
      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoCode,
          subtotal: cartState.subtotal,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setDiscount(data.discount)
        toast({
          title: "Promo code applied!",
          description: `You saved ₹${data.discount}`,
        })
      } else {
        toast({
          title: "Invalid promo code",
          description: data.error || "Please check your promo code and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive",
      })
    } finally {
      setApplyingCoupon(false)
    }
  }

  const subtotal = cartState.subtotal
  const finalTotal = subtotal - discount

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal with slide-in animation from right */}
     <div
  className={`fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-all duration-500 ease-in-out ${
    isOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <p className="text-sm text-gray-500">
                {cartState.totalItems} {cartState.totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartState.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some items to get started!</p>
                <Button onClick={onClose} className="bg-teal-700 hover:bg-teal-800">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Promo Code Section */}
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="font-medium mb-3">Have a promo code?</h3>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button
                      onClick={applyPromoCode}
                      disabled={applyingCoupon || !promoCode.trim()}
                      className="bg-teal-700 hover:bg-teal-800"
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="p-6 space-y-6">
                  {cartState.items.map((item) => {
                    const price = item.variation.salePrice || item.variation.price
                    const originalPrice = item.variation.price
                    const hasDiscount = item.variation.salePrice && item.variation.salePrice < item.variation.price

                    return (
                      <div key={item._id} className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={item.variation.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={onClose}
                              className="text-sm font-medium line-clamp-2 hover:text-teal-700 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item._id, item.product.name)}
                              className="text-gray-400 hover:text-red-500 ml-2 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 mb-2">
                            {item.variation.size} • {item.variation.color}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                ₹{(price * item.quantity).toLocaleString("en-IN")}
                              </div>
                              {hasDiscount && (
                                <div className="text-xs text-gray-500 line-through">
                                  ₹{(originalPrice * item.quantity).toLocaleString("en-IN")}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Move to Wishlist */}
                          <button
                            className="mt-2 text-xs text-teal-700 hover:text-teal-800 flex items-center"
                            onClick={() =>
                              moveToWishlist(item.product_id, item.variation_id, item._id, item.product.name)
                            }
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cartState.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    View Full Cart
                  </Button>
                </Link>

                <Button variant="ghost" onClick={onClose} className="w-full text-gray-600 hover:text-gray-800">
                  Continue Shopping
                </Button>
              </div>

              {/* Guest Notice */}
              {status === "unauthenticated" && (
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Create an account to save your cart</p>
                  <Link href="/register" onClick={onClose}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
