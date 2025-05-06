"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, CreditCard, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import UserAccountSidebar from "@/components/user-account-sidebar"

interface PaymentMethod {
  _id: string
  user_id: string
  card_type: string
  last_four: string
  expiry_month: string
  expiry_year: string
  is_default: boolean
  createdAt: string
  updatedAt: string
}

export default function PaymentMethodsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account/payment-methods")
    }

    if (status === "authenticated") {
      // In a real implementation, you would fetch payment methods from the API
      // For now, we'll use dummy data
      setPaymentMethods([
        {
          _id: "1",
          user_id: "user1",
          card_type: "Visa",
          last_four: "4242",
          expiry_month: "12",
          expiry_year: "2025",
          is_default: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      setLoading(false)
    }
  }, [status, router])

  const handleAddPaymentMethod = () => {
    router.push("/account/payment-methods/new")
  }

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      // In a real implementation, you would call the API to delete the payment method
      setPaymentMethods((prev) => prev.filter((method) => method._id !== id))

      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      })
    }
  }

  const handleSetDefaultPaymentMethod = (id: string) => {
    // In a real implementation, you would call the API to set the default payment method
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        is_default: method._id === id,
      })),
    )

    toast({
      title: "Success",
      description: "Default payment method updated",
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
              <Skeleton className="h-[200px] w-full rounded-md mb-4" />
              <Skeleton className="h-[200px] w-full rounded-md" />
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
            <UserAccountSidebar activeItem="payment-methods" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Payment Methods</h1>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddPaymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-gray-500 mb-4">You don't have any saved payment methods yet.</p>
                  <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddPaymentMethod}>
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method._id}
                      className={`border rounded-md p-4 ${method.is_default ? "border-amber-700 bg-amber-50" : ""}`}
                    >
                      {method.is_default && (
                        <div className="mb-2">
                          <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded">Default</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 mr-3 text-gray-600" />
                        <div>
                          <p className="font-medium">
                            {method.card_type} ending in {method.last_four}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {method.expiry_month}/{method.expiry_year}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600"
                          onClick={() => handleDeletePaymentMethod(method._id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        {!method.is_default && (
                          <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method._id)}>
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
