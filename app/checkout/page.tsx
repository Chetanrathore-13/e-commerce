"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Lock, DollarSignIcon as PaypalLogo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

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

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  // Form state
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [country, setCountry] = useState("India")
  const [countryCode, setCountryCode] = useState("+91")
  const [mobileNumber, setMobileNumber] = useState("")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [processingOrder, setProcessingOrder] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout")
    }

    if (status === "authenticated") {
      fetchCart()
      if (session.user?.email) {
        setEmail(session.user.email)
      }
    }
  }, [status, router, session])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart")

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()

      if (!data.items || data.items.length === 0) {
        router.push("/cart")
        return
      }

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

  const applyPromoCode = () => {
    // In a real implementation, this would validate the promo code with the server
    toast({
      title: "Promo Code",
      description: `Promo code "${promoCode}" applied!`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cart || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    setProcessingOrder(true)

    try {
      // Prepare shipping and billing addresses
      const shippingAddress = {
        full_name: `${firstName} ${lastName}`,
        address_line1: address,
        city,
        state,
        postal_code: zipcode,
        country,
        phone: `${countryCode} ${mobileNumber}`,
      }

      const billingAddress = sameAsBilling
        ? shippingAddress
        : {
            // In a real app, you would collect billing address separately if not same as shipping
            full_name: `${firstName} ${lastName}`,
            address_line1: address,
            city,
            state,
            postal_code: zipcode,
            country,
            phone: `${countryCode} ${mobileNumber}`,
          }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          payment_method: paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to place order")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Your order has been placed successfully!",
      })

      // Redirect to order confirmation page
      router.push(`/account/orders/${data.order._id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setProcessingOrder(false)
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
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
  const total = subtotal + shipping

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center justify-center">
            <Image src="/placeholder.svg?key=a7xss" alt="Samyakk" width={180} height={60} />
          </Link>
          <div className="hidden md:flex items-center">
            <Link href="/cart" className="text-gray-600 hover:text-amber-700 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to cart
            </Link>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-light">Secure Checkout</h1>
          <Separator className="my-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                <div className="bg-amber-50 p-4 border border-amber-200 rounded-md mb-4 flex items-center">
                  <div className="mr-3 bg-amber-700 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm">Unlocking Global Shopping With Free Worldwide Shipping!</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="zipcode">Zipcode *</Label>
                      <Input id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="countryCode">Code *</Label>
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger id="countryCode">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+61">+61</SelectItem>
                          <SelectItem value="+81">+81</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="mobileNumber">Mobile No. *</Label>
                      <Input
                        id="mobileNumber"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                    />
                    <label
                      htmlFor="sameAsBilling"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      My Billing Address Is Same As My Shipping Address
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center">
                        <PaypalLogo className="h-5 w-5 mr-2" />
                        PayPal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                  </div>
                </RadioGroup>
                {paymentMethod === "credit-card" && (
                  <div className="mt-4 space-y-4 p-4 border rounded-md">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" />
                    </div>
                  </div>
                )}
                <div className="mt-6 text-xs text-gray-500 flex items-center">
                  <Lock className="h-4 w-4 mr-1 text-green-600" />
                  Your payment information is secure and encrypted
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-lg py-6"
                disabled={processingOrder}
              >
                {processingOrder ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-md shadow-sm sticky top-20">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>

              {/* Mobile Order Details Toggle */}
              <div className="lg:hidden mb-6">
                <Button
                  variant="outline"
                  className="w-full flex justify-between"
                  onClick={() => setIsOrderDetailsOpen(!isOrderDetailsOpen)}
                >
                  <span>Order Details ({cartItems.length} items)</span>
                  <span>{isOrderDetailsOpen ? "−" : "+"}</span>
                </Button>
              </div>

              {/* Order Items - Mobile Collapsible / Desktop Always Visible */}
              <div
                className={`${isOrderDetailsOpen ? "block" : "hidden"} lg:block space-y-4 max-h-80 overflow-y-auto mb-6`}
              >
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.variation.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.variation.size}, Color: {item.variation.color}
                      </p>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <p className="font-medium mb-2">PROMOCODE?</p>
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Enter coupon code here"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button
                    className="rounded-l-none bg-gray-700 hover:bg-gray-800"
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-lg font-medium">Order Total</span>
                  <span className="text-lg font-medium">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
