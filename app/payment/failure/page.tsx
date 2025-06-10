"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)

  const txnId = searchParams.get("txnId")
  const error = searchParams.get("error")

  useEffect(() => {
    if (txnId) {
      // Optionally check payment status to get more details
      checkPaymentStatus()
    }
  }, [txnId, checkPaymentStatus])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/phonepe/status?txnId=${txnId}`)
      const data = await response.json()
      if (data.success) {
        setPaymentData(data.data)
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
              <CardDescription>Unfortunately, your payment could not be processed. Please try again.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {paymentData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono">{paymentData.merchantTransactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span>₹{paymentData.amount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-red-600 font-semibold capitalize">{paymentData.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <h3 className="font-semibold">What can you do?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Try Again</p>
                    <p className="text-gray-600">Retry the payment with the same or different method</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <ArrowLeft className="h-5 w-5 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">Choose Different Method</p>
                    <p className="text-gray-600">Go back and select a different payment option</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/checkout">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/cart">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Link>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Need help?{" "}
                  <Link href="/contact" className="text-blue-600 hover:underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
