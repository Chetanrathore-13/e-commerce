"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, Check, CreditCard, AlertCircle, Banknote } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCart } from "@/contexts/cart-context"

// Declare Razorpay global
declare global {
  interface Window {
    Razorpay: any
  }
}

interface Coupon {
  _id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  description: string
}

interface PaymentSettings {
  cod_enabled: boolean
  cod_min_order_value: number
  cod_max_order_value: number
  online_payment_enabled: boolean
  paypal_enabled: boolean
  bank_transfer_enabled: boolean
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { state: cartState, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null)
  const [loadingPaymentSettings, setLoadingPaymentSettings] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

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
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [processingOrder, setProcessingOrder] = useState(false)

  // Guest checkout state
  const [createAccount, setCreateAccount] = useState(true)

  useEffect(() => {
    // Check if cart is empty
    if (cartState.items.length === 0) {
      router.push("/cart")
      return
    }

    // Pre-fill email if user is authenticated
    if (status === "authenticated" && session.user?.email) {
      setEmail(session.user.email)
    }

    fetchPaymentSettings()
  }, [status, router, session, cartState.items.length])

  const fetchPaymentSettings = async () => {
    try {
      setLoadingPaymentSettings(true)
      const response = await fetch("/api/payment-settings")

      if (!response.ok) {
        throw new Error("Failed to fetch payment settings")
      }

      const data = await response.json()
      setPaymentSettings(data)
    } catch (error) {
      console.error("Error fetching payment settings:", error)
    } finally {
      setLoadingPaymentSettings(false)
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
          cartTotal: cartState.subtotal || 0,
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
      description: "Coupon has been removed from your order",
    })
  }

  // Check if COD is available for the current order
  const isCodAvailable = () => {
    if (!paymentSettings || !paymentSettings.cod_enabled) return false

    const orderTotal = cartState.subtotal || 0
    return orderTotal >= paymentSettings.cod_min_order_value && orderTotal <= paymentSettings.cod_max_order_value
  }

  const handleRazorpayPayment = async (orderId: string) => {
    try {
      if (!razorpayLoaded) {
        toast({
          title: "Error",
          description: "Razorpay is still loading. Please try again.",
          variant: "destructive",
        })
        return
      }

      const finalTotal = (cartState.subtotal || 0) - discountAmount

      // Create Razorpay order
      const response = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount: finalTotal,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create Razorpay order")
      }

      // Configure Razorpay options
      const options = {
        key: data.data.key,
        amount: data.data.amount,
        currency: data.data.currency,
        name: data.data.name,
        description: data.data.description,
        image: data.data.image,
        order_id: data.data.orderId,
        prefill: data.data.prefill,
        theme: data.data.theme,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Clear cart after successful payment
              clearCart()

              toast({
                variant: "success",
                title: "Payment Successful!",
                description: "Your order has been placed successfully.",
              })

              // Redirect to order confirmation page
              router.push(`/payment/success?orderId=${verifyData.data.orderId}`)
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: error instanceof Error ? error.message : "Please contact support",
              variant: "destructive",
            })
          }
        },
        modal: {
          ondismiss: () => {
          
            setProcessingOrder(false)
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Razorpay payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate Razorpay payment",
        variant: "destructive",
      })
      setProcessingOrder(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartState.items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    // Validate form fields
    if (!firstName || !lastName || !address || !city || !state || !zipcode || !mobileNumber || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setProcessingOrder(true)

    try {
      const shippingAddress = {
        full_name: `${firstName} ${lastName}`.trim(),
        address_line1: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: zipcode.trim(),
        country: country.trim(),
        phone: `${countryCode} ${mobileNumber}`.trim(),
      }

      const billingAddress = sameAsBilling ? { ...shippingAddress } : shippingAddress

      // Prepare the order data
      const orderData = {
        // Customer information
        customer: {
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          phone: `${countryCode} ${mobileNumber}`.trim(),
          create_account: createAccount,
        },
        // Cart items
        items: cartState.items.map((item) => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          price: item.variation.salePrice || item.variation.price,
          name: item.product.name,
          image: item.variation.image,
          size: item.variation.size,
          color: item.variation.color,
        })),
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code,
        discount_amount: discountAmount,
        subtotal: cartState.subtotal,
        total: (cartState.subtotal || 0) - discountAmount,
        guest_checkout: status !== "authenticated",
      }

      

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
    

      // Handle Razorpay payment
      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment(data.order._id)
        return // Don't show success message yet, wait for payment completion
      }

      // Clear cart for COD orders
      clearCart()

      toast({
        variant: "success",
        title: "Order Placed Successfully",
        description: data.message || "Your order has been placed successfully!",
      })

      // Show account creation message if applicable
      if (data.account_created && data.password) {
        toast({
          title: "Account Created",
          description: `Your account has been created! Login credentials have been sent to ${email}`,
          duration: 8000,
        })
      }

      // Redirect to order confirmation page
      router.push(`/payment/success?orderId=${data.order._id}`)
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

  if (loading) {
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

  const cartItems = cartState.items || []
  const subtotal = cartState.subtotal || 0
  const shipping = 0 // Free shipping
  const finalTotal = subtotal - discountAmount + shipping

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
         
          setRazorpayLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load Razorpay script")
          toast({
            title: "Payment Error",
            description: "Failed to load payment gateway. Please refresh the page.",
            variant: "destructive",
          })
        }}
      />

      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center justify-center">
              <Image src="/parpra-logo.png" alt="PARPRA" width={180} height={60} />
            </Link>
            <div className="hidden md:flex items-center">
              <Link href="/cart" className="text-gray-600 hover:text-teal-700 flex items-center">
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
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "authenticated"}
                      />
                    </div>

                    {status !== "authenticated" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createAccount"
                          checked={createAccount}
                          onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
                        />
                        <label
                          htmlFor="createAccount"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Create an account for faster checkout next time (recommended)
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                  <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                  <div className="bg-teal-50 p-4 border border-teal-200 rounded-md mb-4 flex items-center">
                    <div className="mr-3 bg-teal-700 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm">Unlocking Global Shopping With Free Worldwide Shipping!</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                    </div>
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
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
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

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                  <h2 className="text-xl font-medium mb-4">Payment Method</h2>

                  {/* Payment Method Selection */}
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                    <div className="space-y-4">
                      {/* Razorpay Option */}
                      <div
                        className={`flex items-center space-x-2 border rounded-md p-4 ${paymentMethod === "razorpay" ? "border-blue-500 bg-blue-50" : ""}`}
                      >
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex items-center cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                          Razorpay (Cards, UPI, Wallets, Net Banking)
                        </Label>
                      </div>

                      {/* Cash on Delivery Option */}
                      {isCodAvailable() && (
                        <div
                          className={`flex items-center space-x-2 border rounded-md p-4 ${paymentMethod === "cod" ? "border-teal-500 bg-teal-50" : ""}`}
                        >
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex items-center cursor-pointer">
                            <Banknote className="h-5 w-5 mr-2 text-teal-700" />
                            Cash on Delivery (COD)
                          </Label>
                        </div>
                      )}
                    </div>
                  </RadioGroup>

                  {/* Razorpay Information */}
                  {paymentMethod === "razorpay" && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="font-medium text-blue-800 mb-2">Razorpay Payment Information</h3>
                      <p className="text-sm text-blue-700 mb-2">
                        Pay securely using Razorpay - India's leading payment gateway trusted by millions.
                      </p>
                      <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
                        <li>Supports Credit/Debit Cards, UPI, Net Banking, and Digital Wallets</li>
                        <li>Instant payment confirmation and receipt</li>
                        <li>Bank-level security with 256-bit SSL encryption</li>
                        <li>No additional charges for most payment methods</li>
                        <li>Easy refunds and customer support</li>
                      </ul>
                      {!razorpayLoaded && <div className="mt-2 text-xs text-amber-600">Loading payment gateway...</div>}
                    </div>
                  )}

                  {/* COD Information */}
                  {paymentMethod === "cod" && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <h3 className="font-medium text-amber-800 mb-2">Cash on Delivery Information</h3>
                      <p className="text-sm text-amber-700 mb-2">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                      <ul className="text-xs text-amber-600 list-disc list-inside space-y-1">
                        <li>Please keep the exact amount ready for a smooth delivery experience</li>
                        <li>Our delivery partner will provide a receipt upon payment</li>
                        <li>
                          COD is available for orders between ₹
                          {paymentSettings?.cod_min_order_value.toLocaleString("en-IN")} and ₹
                          {paymentSettings?.cod_max_order_value.toLocaleString("en-IN")}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full text-lg py-6 ${
                    paymentMethod === "razorpay" ? "bg-blue-600 hover:bg-blue-700" : "bg-teal-700 hover:bg-teal-800"
                  }`}
                  disabled={processingOrder || (paymentMethod === "razorpay" && !razorpayLoaded)}
                >
                  {processingOrder
                    ? "Processing..."
                    : paymentMethod === "razorpay"
                      ? `Pay with Razorpay - ₹${finalTotal.toLocaleString("en-IN")}`
                      : `Place Order - ₹${finalTotal.toLocaleString("en-IN")}`}
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
                          <span className="font-medium">
                            ₹
                            {((item.variation.salePrice || item.variation.price) * item.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </span>
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
                        Discount
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

                  {/* COD Eligibility Message */}
                  {isCodAvailable() && (
                    <div className="mt-2 text-xs text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Eligible for Cash on Delivery
                    </div>
                  )}

                  {!isCodAvailable() && paymentSettings?.cod_enabled && (
                    <div className="mt-2 text-xs text-amber-600">
                      COD available for orders between ₹{paymentSettings.cod_min_order_value.toLocaleString("en-IN")}{" "}
                      and ₹{paymentSettings.cod_max_order_value.toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
