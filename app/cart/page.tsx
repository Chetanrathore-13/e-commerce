"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Heart, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export default function CartPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { state: cartState, updateCartItem, removeFromCart } = useCart()
  const { addToWishlist } = useWishlist()
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Set loading to false after a short delay to show the current state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }))

    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleRemoveItem = async (itemId: string, productName: string) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }))

    try {
      await removeFromCart(itemId)
      toast({
        title: "Item removed",
        description: `${productName} has been removed from your cart`,
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleMoveToWishlist = async (item: any) => {
    setUpdatingItems((prev) => ({ ...prev, [item._id]: true }))

    try {
      await addToWishlist(item.product_id, item.variation_id)
      await removeFromCart(item._id)
      toast({
        title: "Moved to wishlist",
        description: `${item.product.name} moved to your wishlist`,
      })
    } catch (error) {
      console.error("Error moving item to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to move item to wishlist",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    setCouponLoading(true)
    setCouponError("")
    setCouponSuccess("")

    try {
      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: cartState.subtotal,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || "Invalid coupon code")
        setDiscount(0)
        return
      }

      setCouponSuccess(`Coupon applied! You saved ₹${data.discount}`)
      setDiscount(data.discount)
    } catch (error) {
      console.error("Error applying coupon:", error)
      setCouponError("Failed to apply coupon")
      setDiscount(0)
    } finally {
      setCouponLoading(false)
    }
  }

  const proceedToCheckout = () => {
    if (cartState.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-light">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartState.totalItems} {cartState.totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
          {cartState.totalItems > 0 && (
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          )}
        </div>

        {cartState.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-24 w-24 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button onClick={() => router.push("/products")} className="bg-teal-700 hover:bg-teal-800 px-8">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Cart Items ({cartState.totalItems})</h2>
                </div>
                <div className="divide-y">
                  {cartState.items.map((item) => {
                    const price = item.variation.salePrice || item.variation.price
                    const originalPrice = item.variation.price
                    const hasDiscount = item.variation.salePrice && item.variation.salePrice < item.variation.price

                    return (
                      <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="sm:w-1/4 mb-4 sm:mb-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="block relative aspect-[3/4] rounded-lg overflow-hidden"
                          >
                            <Image
                              src={item.variation.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="sm:w-3/4 flex flex-col">
                          <div className="flex justify-between mb-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-lg font-medium hover:text-teal-700 transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                disabled={updatingItems[item._id]}
                                title="Move to wishlist"
                              >
                                <Heart className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item._id, item.product.name)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                disabled={updatingItems[item._id]}
                                title="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-3">
                            <span>Size: {item.variation.size}</span>
                            <span className="mx-2">•</span>
                            <span>Color: {item.variation.color}</span>
                          </div>

                          <div className="mt-auto flex flex-wrap justify-between items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                disabled={item.quantity <= 1 || updatingItems[item._id]}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                disabled={updatingItems[item._id]}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="flex items-center">
                              {updatingItems[item._id] && (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-700 mr-3"></div>
                              )}
                              <div className="text-right">
                                <div className="text-lg font-semibold">
                                  ₹{(price * item.quantity).toLocaleString("en-IN")}
                                </div>
                                {hasDiscount && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ₹{(originalPrice * item.quantity).toLocaleString("en-IN")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartState.totalQuantity} items)</span>
                    <span className="font-medium">₹{cartState.subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{(cartState.subtotal - discount).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1"
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-teal-700 hover:bg-teal-800"
                    >
                      {couponLoading ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-green-500 text-sm mt-1">{couponSuccess}</p>}
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-lg py-6 mb-4"
                  disabled={cartState.items.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full" onClick={() => router.push("/products")}>
                  Continue Shopping
                </Button>

                {/* Guest User Notice */}
                {status === "unauthenticated" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Save Your Cart</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Create an account to save your cart and track your orders.
                    </p>
                    <Link href="/register">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
