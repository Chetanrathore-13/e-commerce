"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, XCircle, ArrowRight, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface PaymentStatus {
  success: boolean
  payment: {
    merchantTransactionId: string
    status: string
    amount: number
    orderId: string
  }
  phonepeResponse: {
    success: boolean
    data?: {
      state: string
      responseCode: string
      transactionId: string
    }
  }
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const merchantTransactionId = searchParams.get("txnId")

  useEffect(() => {
    if (!merchantTransactionId) {
      setError("Missing transaction ID")
      setLoading(false)
      return
    }

    checkPaymentStatus()
  }, [merchantTransactionId])

  const checkPaymentStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/payments/phonepe/status?merchantTransactionId=${merchantTransactionId}`)

      if (!response.ok) {
        throw new Error("Failed to check payment status")
      }

      const data = await response.json()
      setPaymentStatus(data)

      // Show appropriate toast based on status
      if (data.success && data.payment.status === "completed") {
        toast({
          title: "Payment Successful!",
          description: "Your order has been confirmed and will be processed soon.",
          variant: "success",
        })
      } else if (data.payment.status === "pending") {
        toast({
          title: "Payment Pending",
          description: "Your payment is being processed. Please wait.",
          variant: "default",
        })
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue with your payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
      setError("Failed to verify payment status")
      toast({
        title: "Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!paymentStatus) return <Clock className="h-16 w-16 text-yellow-500" />

    switch (paymentStatus.payment.status) {
      case "completed":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusMessage = () => {
    if (!paymentStatus)
      return { title: "Checking Payment...", description: "Please wait while we verify your payment." }

    switch (paymentStatus.payment.status) {
      case "completed":
        return {
          title: "Payment Successful!",
          description: "Your order has been confirmed and will be processed soon.",
        }
      case "pending":
        return {
          title: "Payment Pending",
          description: "Your payment is being processed. This may take a few minutes.",
        }
      case "failed":
        return {
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
        }
      default:
        return {
          title: "Payment Status Unknown",
          description: "We're unable to determine your payment status at this time.",
        }
    }
  }

  const getStatusBadge = () => {
    if (!paymentStatus) return <Badge variant="secondary">Checking...</Badge>

    switch (paymentStatus.payment.status) {
      case "completed":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
              <Button variant="outline" onClick={() => router.push("/cart")} className="w-full">
                Back to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-xl font-semibold">{statusMessage.title}</CardTitle>
          <p className="text-gray-600">{statusMessage.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentStatus && (
            <div className="space-y-4">
              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge()}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-sm font-mono">{paymentStatus.payment.merchantTransactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold">₹{paymentStatus.payment.amount.toLocaleString("en-IN")}</span>
                </div>
                {paymentStatus.phonepeResponse.data?.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PhonePe ID:</span>
                    <span className="text-sm font-mono">{paymentStatus.phonepeResponse.data.transactionId}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {paymentStatus.payment.status === "completed" && (
                  <Button asChild className="w-full">
                    <Link href={`/account/orders/${paymentStatus.payment.orderId}`}>
                      <Package className="h-4 w-4 mr-2" />
                      View Order Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}

                {paymentStatus.payment.status === "pending" && (
                  <Button onClick={checkPaymentStatus} variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Status Again
                  </Button>
                )}

                {paymentStatus.payment.status === "failed" && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cart">Retry Payment</Link>
                  </Button>
                )}

                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
