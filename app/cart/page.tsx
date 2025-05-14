"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, X, ShoppingBag, Tag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CartItem {
  _id: string
  product_id: string
  variation_id: string
  quantity: number
  price: number
  added_at: string
  product: {
    _id: string
    name: string
    slug: string
  }
  variation: {
    _id: string
    price: number
    salePrice?: number
    image: string
    size: string
    color: string
  }
}

interface Cart {
  _id: string
  user_id: string
  items: CartItem[]
  total: number
}

interface Coupon {
  _id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  description: string
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/cart")
      return
    }

    if (status === "authenticated") {
      fetchCart()
    }
  }, [status, router])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart")

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fix image paths if needed
  const fixImagePath = (path: string) => {
    if (!path) return "/diverse-products-still-life.png"
    if (path.startsWith("http")) return path
    if (path.startsWith("/")) return path
    return `/${path}`
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update quantity")
      }

      // Update cart locally
      setCart((prevCart) => {
        if (!prevCart) return null

        const updatedItems = prevCart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        )

        const newTotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

        return {
          ...prevCart,
          items: updatedItems,
          total: newTotal,
        }
      })

      // Reset coupon when cart changes
      if (appliedCoupon) {
        validateCoupon(appliedCoupon.code)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      // Update cart locally
      setCart((prevCart) => {
        if (!prevCart) return null

        const updatedItems = prevCart.items.filter((item) => item._id !== itemId)
        const newTotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

        return {
          ...prevCart,
          items: updatedItems,
          total: newTotal,
        }
      })

      toast({
        title: "Success",
        description: "Item removed from cart",
      })

      // Reset coupon when cart changes
      if (appliedCoupon) {
        validateCoupon(appliedCoupon.code)
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const validateCoupon = async (code: string) => {
    if (!code) return

    try {
      setApplyingCoupon(true)
      setCouponError(null)

      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          cartTotal: cart?.total || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || "Invalid coupon code")
        setAppliedCoupon(null)
        setDiscountAmount(0)
        return
      }

      setAppliedCoupon(data.coupon)
      setDiscountAmount(data.discountAmount)

      toast({
        title: "Coupon Applied",
        description: `Coupon "${data.coupon.code}" applied successfully!`,
      })
    } catch (error) {
      console.error("Error validating coupon:", error)
      setCouponError("Failed to validate coupon")
      setAppliedCoupon(null)
      setDiscountAmount(0)
    } finally {
      setApplyingCoupon(false)
    }
  }

  const applyPromoCode = () => {
    if (!promoCode) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    validateCoupon(promoCode)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setPromoCode("")
    setCouponError(null)

    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your cart",
    })
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="bg-white min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-md" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  const subtotal = cart?.total || 0
  const shipping = 0 // Free shipping
  const finalTotal = subtotal - discountAmount + shipping

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-light text-center mb-8">My Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <div className="flex justify-center">
              <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
            </div>
            <Link href="/products">
              <Button className="bg-teal-700 hover:bg-teal-800">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-md shadow-sm border">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="block relative aspect-square rounded-md overflow-hidden"
                      >
                        <Image
                          src={fixImagePath(item.variation.image) || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between mb-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-lg font-medium hover:text-teal-700 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          aria-label="Remove from cart"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Size: {item.variation.size}, Color: {item.variation.color}
                      </p>
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="font-medium text-lg">₹{item.price.toLocaleString("en-IN")}</p>
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-md shadow-sm border sticky top-20">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <p className="font-medium mb-2">PROMOCODE?</p>
                  <div className="flex">
                    <Input
                      type="text"
                      placeholder="Enter coupon code here"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="rounded-r-none"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <Button className="rounded-l-none bg-red-600 hover:bg-red-700" onClick={removeCoupon}>
                        Remove
                      </Button>
                    ) : (
                      <Button
                        className="rounded-l-none bg-teal-700 hover:bg-teal-800"
                        onClick={applyPromoCode}
                        disabled={!promoCode || applyingCoupon}
                      >
                        {applyingCoupon ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>

                  {couponError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{couponError}</AlertDescription>
                    </Alert>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-start">
                        <Tag className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-700">{appliedCoupon.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" /> Discount
                        {appliedCoupon.discount_type === "percentage" && ` (${appliedCoupon.discount_value}%)`}
                      </span>
                      <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Order Total</span>
                    <span className="text-lg font-medium">₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4 ">
                  <Link href="/checkout">
                    <Button className="w-full bg-teal-700 hover:bg-teal-800 text-lg py-6 mb-4">Checkout</Button>
                  </Link>
                  <Link href="/products">
                    <Button className="w-full border border-teal-700 bg-white text-teal-700 hover:bg-teal-50 text-lg py-6">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
