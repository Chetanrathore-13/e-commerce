"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
  order_number: string
  user_id: string
  items: OrderItem[]
  subtotal: number
  discount: number
  coupon_code?: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: Address
  billing_address: Address
  payment_method: string
  payment_status: "pending" | "paid" | "failed"
  tracking_number?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account/orders")
      return
    }

    if (status === "authenticated" && params.id) {
      fetchOrder(params.id)
    }
  }, [status, params.id, router])

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)

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

  // Fix image paths if needed
  const fixImagePath = (path: string) => {
    if (!path) return "/diverse-products-still-life.png"
    if (path.startsWith("http")) return path
    if (path.startsWith("/")) return path
    return `/${path}`
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
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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
            <div className="md:w-1/4">
              <UserAccountSidebar />
            </div>
            <div className="md:w-3/4">
              <Skeleton className="h-12 w-1/3 mb-8" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-md" />
                ))}
              </div>
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
            <div className="md:w-1/4">
              <UserAccountSidebar />
            </div>
            <div className="md:w-3/4">
              <div className="bg-white p-8 rounded-md shadow-sm">
                <h1 className="text-2xl font-medium mb-4">Order Not Found</h1>
                <p className="text-gray-500 mb-6">
                  The order you are looking for does not exist or you do not have permission to view it.
                </p>
                <Link href="/account/orders">
                  <Button className="bg-teal-700 hover:bg-teal-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                  </Button>
                </Link>
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
          <div className="md:w-1/4">
            <UserAccountSidebar />
          </div>
          <div className="md:w-3/4">
            <div className="bg-white p-6 rounded-md shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-medium">Order #{order.order_number}</h1>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <Link href="/account/orders">
                  <Button variant="outline" className="mt-4 md:mt-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                  </Button>
                </Link>
              </div>

              <Separator className="my-6" />

              {/* Order Items */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                      <div className="w-full md:w-1/6">
                        <div className="relative aspect-square rounded-md overflow-hidden">
                          <Image
                            src={fixImagePath(item.image) || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
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

              <Separator className="my-6" />

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                  </div>

                  <h2 className="text-xl font-medium mt-6 mb-4">Payment Information</h2>
                  <div className="p-4 border rounded-md">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).replace("-", " ")}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      <Badge
                        className={
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.payment_status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  <div className="p-4 border rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{order.subtotal?.toLocaleString("en-IN") || order.total.toLocaleString("en-IN")}</span>
                      </div>

                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" /> Discount
                            {order.coupon_code && ` (${order.coupon_code})`}
                          </span>
                          <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                        </div>
                      )}

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

                  {order.tracking_number && (
                    <div className="mt-6">
                      <h2 className="text-xl font-medium mb-4">Tracking Information</h2>
                      <div className="p-4 border rounded-md">
                        <p>
                          <span className="font-medium">Tracking Number:</span> {order.tracking_number}
                        </p>
                        <Button className="mt-4 bg-teal-700 hover:bg-teal-800">Track Package</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-medium mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about your order, please contact our customer support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
                <Button variant="outline">Request Return</Button>
                <Button variant="outline">Cancel Order</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
