"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, Package, CheckCircle, XCircle, Clock, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export function OrderDetail({ order }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "")
  const [notes, setNotes] = useState(order.notes || "")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    processing: <Package className="h-5 w-5 text-blue-500" />,
    shipped: <Truck className="h-5 w-5 text-purple-500" />,
    delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
    cancelled: <XCircle className="h-5 w-5 text-red-500" />,
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const handleStatusChange = async () => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: currentStatus,
          tracking_number: trackingNumber,
          notes: notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Order updated",
          description: `Order #${order.order_number} has been updated successfully.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Update failed",
          description: data.error || "Failed to update order status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setIsDialogOpen(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <Badge className={`ml-2 ${statusColors[order.status]} border`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Update Order</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order #{order.order_number}</DialogTitle>
                <DialogDescription>Change the order status, add tracking information, or notes.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={currentStatus} onValueChange={setCurrentStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this order"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                <dd>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(order.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                <dd className="flex items-center space-x-2">
                  {statusIcons[order.status]}
                  <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd>{order.payment_method}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd>
                  <Badge
                    className={
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : order.payment_status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </Badge>
                </dd>
              </div>
              {order.tracking_number && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                  <dd>{order.tracking_number}</dd>
                </div>
              )}
              {order.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="text-sm">{order.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                <dd>{order.shipping_address.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd>{order.user_email || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd>{order.shipping_address.phone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                <dd>
                  <address className="not-italic">
                    {order.shipping_address.full_name}
                    <br />
                    {order.shipping_address.address_line1}
                    <br />
                    {order.shipping_address.address_line2 && (
                      <>
                        {order.shipping_address.address_line2}
                        <br />
                      </>
                    )}
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    <br />
                    {order.shipping_address.country}
                  </address>
                </dd>
              </div>
              {order.status === "shipped" && order.tracking_number && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tracking</dt>
                  <dd className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-purple-500" />
                    <span>{order.tracking_number}</span>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Size: {item.size} | Color: {item.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <th colSpan={3} className="px-6 py-4 text-right">
                    Subtotal
                  </th>
                  <td className="px-6 py-4 text-right">
                    ₹{order.subtotal ? order.subtotal.toFixed(2) : order.total.toFixed(2)}
                  </td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <th colSpan={3} className="px-6 py-4 text-right">
                      Discount {order.coupon_code && `(${order.coupon_code})`}
                    </th>
                    <td className="px-6 py-4 text-right text-red-600">-₹{order.discount.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t font-bold">
                  <th colSpan={3} className="px-6 py-4 text-right">
                    Total
                  </th>
                  <td className="px-6 py-4 text-right">₹{order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
