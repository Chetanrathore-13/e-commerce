"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import UserAccountSidebar from "@/components/user-account-sidebar"

interface OrderItem {
  _id: string
  product_id: string
  variation_id: string
  quantity: number
  price: number
  name: string
  image: string
  size: string
  color: string
}

interface Address {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

interface Order {
  _id: string
  user_id: string
  order_number: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: Address
  billing_address: Address
  payment_method: string
  payment_status: "pending" | "paid" | "failed"
  tracking_number?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account/orders")
    }

    if (status === "authenticated" && params.id) {
      fetchOrder()
    }
  }, [status, router, params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch order")
      }

      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async () => {
    if (!order) return

    if (!confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      setCancelling(true)
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      // Update order status locally
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null))

      toast({
        title: "Success",
        description: "Order cancelled successfully",
      })
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      })
    } finally {
      setCancelling(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Pending"
      case "processing":
        return "Order Processing"
      case "shipped":
        return "Order Shipped"
      case "delivered":
        return "Order Delivered"
      case "cancelled":
        return "Order Cancelled"
      default:
        return "Unknown Status"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-12 w-1/3 mb-6" />
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-[400px] w-full rounded-md mb-6" />
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <UserAccountSidebar activeItem="orders" />
            </div>
            <div className="flex-1">
              <div className="bg-white p-6 rounded-md shadow-sm">
                <div className="flex items-center mb-6">
                  <Link href="/account/orders" className="text-amber-700 hover:text-amber-800 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </div>
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-medium mb-2">Order Not Found</h2>
                  <p className="text-gray-500 mb-6">
                    The order you're looking for doesn't exist or you don't have permission to view it.
                  </p>
                  <Link href="/account/orders">
                    <Button className="bg-amber-700 hover:bg-amber-800">View All Orders</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <UserAccountSidebar activeItem="orders" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <Link href="/account/orders" className="text-amber-700 hover:text-amber-800 flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
                <p className="text-sm text-gray-500">Order Date: {formatDate(order.createdAt)}</p>
              </div>

              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-medium mb-1">Order #{order.order_number}</h1>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{getStatusText(order.status)}</span>
                  </div>
                </div>
                {order.status === "pending" || order.status === "processing" ? (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={cancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                ) : null}
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <p
                      className={`font-medium ${order.payment_status === "paid" ? "text-green-600" : order.payment_status === "failed" ? "text-red-600" : "text-amber-600"}`}
                    >
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium">
                      {order.payment_method
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                  </div>
                  {order.tracking_number && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                      <p className="font-medium">{order.tracking_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                      <div className="w-full md:w-1/6">
                        <div className="relative aspect-square rounded-md overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size}, Color: {item.color}
                        </p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm">Quantity: {item.quantity}</p>
                          <p className="font-medium">₹{item.price.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Billing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    <p className="mt-2">{order.shipping_address.phone}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-4">Billing Address</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{order.billing_address.full_name}</p>
                    <p>{order.billing_address.address_line1}</p>
                    {order.billing_address.address_line2 && <p>{order.billing_address.address_line2}</p>}
                    <p>
                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                    </p>
                    <p>{order.billing_address.country}</p>
                    <p className="mt-2">{order.billing_address.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
