"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const txnId = searchParams.get("txnId")

  useEffect(() => {
    if (!txnId) {
      setError("Transaction ID not found")
      setLoading(false)
      return
    }

    checkPaymentStatus()
  }, [txnId])

  const checkPaymentStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/payments/phonepe/status?txnId=${txnId}`)
      const data = await response.json()

      if (data.success) {
        setPaymentData(data.data)

        if (data.data.status === "completed") {
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully.",
            variant: "success",
          })
        } else if (data.data.status === "pending") {
          toast({
            title: "Payment Pending",
            description: "Your payment is being processed. Please wait.",
            variant: "default",
          })
        } else {
          setError("Payment failed or was cancelled")
        }
      } else {
        setError(data.error || "Failed to verify payment status")
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
      setError("Failed to verify payment status")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-red-600">Payment Verification Failed</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/cart")}>
                Back to Cart
              </Button>
              <Button onClick={() => router.push("/account/orders")}>View Orders</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully and your order has been placed.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {paymentData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono">{paymentData.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold">₹{paymentData.amount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span>PhonePe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-semibold capitalize">{paymentData.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="text-center space-y-4">
                <h3 className="font-semibold">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Order Processing</p>
                    <p className="text-gray-600">We'll start preparing your order right away</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium">Shipping Updates</p>
                    <p className="text-gray-600">You'll receive tracking information via email</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/account/orders">View My Orders</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
