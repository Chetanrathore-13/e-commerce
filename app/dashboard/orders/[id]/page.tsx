import { notFound } from "next/navigation"
import { OrderDetail } from "./order-detail"
import { getOrderById } from "@/lib/api"

export const metadata = {
  title: "Order Details | Admin Dashboard",
  description: "View and manage order details",
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params
  try {
    const order = await getOrderById(id, true) // true for admin mode
    console.log("order", order)
    if (!order) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <OrderDetail order={order} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching order:", error)
    notFound()
  }
}
