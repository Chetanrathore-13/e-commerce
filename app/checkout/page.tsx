"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Lock, DollarSignIcon as PaypalLogo, PlusCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

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

interface Address {
  _id: string
  user_id: string
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}

interface PaymentMethod {
  _id: string
  user_id: string
  type: string
  provider: string
  card_number?: string
  card_holder_name?: string
  expiry_month?: string
  expiry_year?: string
  is_default: boolean
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)

  // Selected address and payment method
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("")
  const [newAddressMode, setNewAddressMode] = useState(false)
  const [newPaymentMode, setNewPaymentMode] = useState(false)

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

  // Credit card details
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout")
    }

    if (status === "authenticated") {
      fetchCart()
      fetchAddresses()
      fetchPaymentMethods()
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

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true)
      const response = await fetch("/api/user/addresses")

      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }

      const data = await response.json()
      setAddresses(data.addresses || [])

      // Select default address if available
      const defaultAddress = data.addresses.find((addr: Address) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id)
        // Pre-fill form with default address
        setFirstName(defaultAddress.full_name.split(" ")[0] || "")
        setLastName(defaultAddress.full_name.split(" ").slice(1).join(" ") || "")
        setAddress(defaultAddress.address_line1)
        setCity(defaultAddress.city)
        setState(defaultAddress.state)
        setZipcode(defaultAddress.postal_code)
        setCountry(defaultAddress.country)
        const phone = defaultAddress.phone.split(" ")
        if (phone.length > 1) {
          setCountryCode(phone[0])
          setMobileNumber(phone[1])
        } else {
          setMobileNumber(defaultAddress.phone)
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true)
      const response = await fetch("/api/user/payment-methods")

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods")
      }

      const data = await response.json()
      setPaymentMethods(data.paymentMethods || [])

      // Select default payment method if available
      const defaultPaymentMethod = data.paymentMethods.find((method: PaymentMethod) => method.is_default)
      if (defaultPaymentMethod) {
        setSelectedPaymentMethodId(defaultPaymentMethod._id)
        setPaymentMethod(defaultPaymentMethod.type)

        if (defaultPaymentMethod.type === "credit-card") {
          setCardNumber(defaultPaymentMethod.card_number || "")
          setCardHolder(defaultPaymentMethod.card_holder_name || "")
          if (defaultPaymentMethod.expiry_month && defaultPaymentMethod.expiry_year) {
            setExpiryDate(`${defaultPaymentMethod.expiry_month}/${defaultPaymentMethod.expiry_year.slice(-2)}`)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  const applyPromoCode = () => {
    // In a real implementation, this would validate the promo code with the server
    toast({
      title: "Promo Code",
      description: `Promo code "${promoCode}" applied!`,
    })
  }

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId)

    if (addressId === "new") {
      setNewAddressMode(true)
      // Clear form for new address
      setFirstName("")
      setLastName("")
      setAddress("")
      setCity("")
      setState("")
      setZipcode("")
      setCountry("India")
      setCountryCode("+91")
      setMobileNumber("")
      return
    }

    setNewAddressMode(false)
    // Find the selected address
    const selectedAddress = addresses.find((addr) => addr._id === addressId)
    if (selectedAddress) {
      // Pre-fill form with selected address
      setFirstName(selectedAddress.full_name.split(" ")[0] || "")
      setLastName(selectedAddress.full_name.split(" ").slice(1).join(" ") || "")
      setAddress(selectedAddress.address_line1)
      setCity(selectedAddress.city)
      setState(selectedAddress.state)
      setZipcode(selectedAddress.postal_code)
      setCountry(selectedAddress.country)
      const phone = selectedAddress.phone.split(" ")
      if (phone.length > 1) {
        setCountryCode(phone[0])
        setMobileNumber(phone[1])
      } else {
        setMobileNumber(selectedAddress.phone)
      }
    }
  }

  const handlePaymentMethodChange = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId)

    if (paymentMethodId === "new") {
      setNewPaymentMode(true)
      // Clear form for new payment method
      setCardNumber("")
      setCardHolder("")
      setExpiryDate("")
      setCvv("")
      return
    }

    setNewPaymentMode(false)
    // Find the selected payment method
    const selectedMethod = paymentMethods.find((method) => method._id === paymentMethodId)
    if (selectedMethod) {
      setPaymentMethod(selectedMethod.type)

      if (selectedMethod.type === "credit-card") {
        setCardNumber(selectedMethod.card_number || "")
        setCardHolder(selectedMethod.card_holder_name || "")
        if (selectedMethod.expiry_month && selectedMethod.expiry_year) {
          setExpiryDate(`${selectedMethod.expiry_month}/${selectedMethod.expiry_year.slice(-2)}`)
        }
      }
    }
  }

  const saveNewAddress = async () => {
    try {
      const addressData = {
        full_name: `${firstName} ${lastName}`,
        address_line1: address,
        city,
        state,
        postal_code: zipcode,
        country,
        phone: `${countryCode} ${mobileNumber}`,
        is_default: addresses.length === 0, // Make default if it's the first address
      }

      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        throw new Error("Failed to save address")
      }

      const data = await response.json()

      // Add new address to list and select it
      setAddresses([...addresses, data.address])
      setSelectedAddressId(data.address._id)
      setNewAddressMode(false)

      toast({
        title: "Success",
        description: "Address saved successfully",
      })
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    }
  }

  const saveNewPaymentMethod = async () => {
    try {
      // Parse expiry date
      const [expiryMonth, expiryYear] = expiryDate.split("/")

      const paymentData = {
        type: paymentMethod,
        provider: paymentMethod === "credit-card" ? "card" : paymentMethod,
        card_number: cardNumber.replace(/\s/g, ""),
        card_holder_name: cardHolder,
        expiry_month: expiryMonth,
        expiry_year: `20${expiryYear}`,
        is_default: paymentMethods.length === 0, // Make default if it's the first method
      }

      const response = await fetch("/api/user/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error("Failed to save payment method")
      }

      const data = await response.json()

      // Add new payment method to list and select it
      setPaymentMethods([...paymentMethods, data.paymentMethod])
      setSelectedPaymentMethodId(data.paymentMethod._id)
      setNewPaymentMode(false)

      toast({
        title: "Success",
        description: "Payment method saved successfully",
      })
    } catch (error) {
      console.error("Error saving payment method:", error)
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      })
    }
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

    // Validate that an address is selected or entered
    if (!selectedAddressId && addresses.length > 0 && !newAddressMode) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      })
      return
    }

    // Validate that a payment method is selected or entered
    if (!selectedPaymentMethodId && paymentMethods.length > 0 && !newPaymentMode) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    // Validate form fields if using new address
    if (newAddressMode || addresses.length === 0) {
      if (!firstName || !lastName || !address || !city || !state || !zipcode || !mobileNumber) {
        toast({
          title: "Error",
          description: "Please fill in all required address fields",
          variant: "destructive",
        })
        return
      }
    }

    // Validate payment details if using new payment method
    if (newPaymentMode || paymentMethods.length === 0) {
      if (paymentMethod === "credit-card" && (!cardNumber || !expiryDate || !cardHolder)) {
        toast({
          title: "Error",
          description: "Please fill in all required payment details",
          variant: "destructive",
        })
        return
      }
    }

    setProcessingOrder(true)

    try {
      let shippingAddress
      let selectedPaymentType

      // If using a saved address
      if (selectedAddressId && selectedAddressId !== "new" && !newAddressMode) {
        const savedAddress = addresses.find((addr) => addr._id === selectedAddressId)
        if (savedAddress) {
          shippingAddress = {
            full_name: savedAddress.full_name,
            address_line1: savedAddress.address_line1,
            address_line2: savedAddress.address_line2 || "",
            city: savedAddress.city,
            state: savedAddress.state,
            postal_code: savedAddress.postal_code,
            country: savedAddress.country,
            phone: savedAddress.phone,
          }
        }
      } else {
        // Using new address
        shippingAddress = {
          full_name: `${firstName} ${lastName}`.trim(),
          address_line1: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postal_code: zipcode.trim(),
          country: country.trim(),
          phone: `${countryCode} ${mobileNumber}`.trim(),
        }
      }

      // If using a saved payment method
      if (selectedPaymentMethodId && selectedPaymentMethodId !== "new" && !newPaymentMode) {
        const savedPayment = paymentMethods.find((method) => method._id === selectedPaymentMethodId)
        if (savedPayment) {
          selectedPaymentType = savedPayment.type
        }
      } else {
        // Using new payment method
        selectedPaymentType = paymentMethod
      }

      // Ensure we have a valid shipping address
      if (!shippingAddress) {
        throw new Error("Invalid shipping address")
      }

      const billingAddress = sameAsBilling
        ? { ...shippingAddress }
        : {
            // In a real app, you would collect billing address separately if not same as shipping
            full_name: `${firstName} ${lastName}`.trim(),
            address_line1: address.trim(),
            city: city.trim(),
            state: state.trim(),
            postal_code: zipcode.trim(),
            country: country.trim(),
            phone: `${countryCode} ${mobileNumber}`.trim(),
          }

      // Prepare the order data
      const orderData = {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: selectedPaymentType || paymentMethod,
      }

      // Log the data being sent for debugging
      console.log("Sending order data:", orderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      // Log the raw response for debugging
      console.log("Order API response status:", response.status)
      console.log("Order API response headers:", Object.fromEntries([...response.headers.entries()]))

      // Try to parse the response as JSON, but handle non-JSON responses
      let errorData = {}
      let responseText = ""

      try {
        responseText = await response.text()
        console.log("Raw response text:", responseText)

        if (responseText) {
          try {
            errorData = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Error parsing response as JSON:", parseError)
            errorData = { error: "Invalid response format", rawResponse: responseText }
          }
        }
      } catch (textError) {
        console.error("Error reading response text:", textError)
      }

      if (!response.ok) {
        console.error("Order API error response:", errorData)
        throw new Error(
          errorData.error ||
            `Failed to place order. Status: ${response.status}. ${responseText ? `Response: ${responseText}` : ""}`,
        )
      }

      // Parse the successful response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error parsing successful response:", e)
        throw new Error("Invalid response format from server")
      }

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
            <Image src="/parpra-logo.png" alt="PARPRA" width={180} height={60} />
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

                {/* Saved Addresses */}
                {addresses.length > 0 && !newAddressMode && (
                  <div className="mb-6">
                    <Label htmlFor="savedAddress" className="mb-2 block">
                      Select a Saved Address
                    </Label>
                    <Select value={selectedAddressId} onValueChange={handleAddressChange}>
                      <SelectTrigger id="savedAddress">
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((addr) => (
                          <SelectItem key={addr._id} value={addr._id}>
                            <div className="flex items-center">
                              <span>
                                {addr.full_name} - {addr.address_line1}, {addr.city}
                              </span>
                              {addr.is_default && (
                                <Badge variant="outline" className="ml-2">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center text-amber-700">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Add New Address</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* New Address Form */}
                {(newAddressMode || addresses.length === 0) && (
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

                    {newAddressMode && (
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNewAddressMode(false)
                            if (addresses.length > 0 && selectedAddressId) {
                              handleAddressChange(selectedAddressId)
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={saveNewAddress}>
                          Save Address
                        </Button>
                      </div>
                    )}
                  </div>
                )}

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

                {/* Saved Payment Methods */}
                {paymentMethods.length > 0 && !newPaymentMode && (
                  <div className="mb-6">
                    <Label htmlFor="savedPayment" className="mb-2 block">
                      Select a Saved Payment Method
                    </Label>
                    <Select value={selectedPaymentMethodId} onValueChange={handlePaymentMethodChange}>
                      <SelectTrigger id="savedPayment">
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method._id} value={method._id}>
                            <div className="flex items-center">
                              {method.type === "credit-card" && <CreditCard className="h-4 w-4 mr-2" />}
                              {method.type === "paypal" && <PaypalLogo className="h-4 w-4 mr-2" />}
                              <span>
                                {method.type === "credit-card"
                                  ? `Card ending in ${method.card_number?.slice(-4)}`
                                  : method.type
                                    ? method.type.charAt(0).toUpperCase() + method.type.slice(1)
                                    : "Unknown"}
                              </span>
                              {method.is_default && (
                                <Badge variant="outline" className="ml-2">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center text-amber-700">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Add New Payment Method</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* New Payment Method Form */}
                {(newPaymentMode || paymentMethods.length === 0) && (
                  <>
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
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input id="nameOnCard" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} />
                        </div>
                      </div>
                    )}

                    {newPaymentMode && (
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNewPaymentMode(false)
                            if (paymentMethods.length > 0 && selectedPaymentMethodId) {
                              handlePaymentMethodChange(selectedPaymentMethodId)
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={saveNewPaymentMethod}>
                          Save Payment Method
                        </Button>
                      </div>
                    )}
                  </>
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
