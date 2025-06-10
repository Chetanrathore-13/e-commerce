import crypto from "crypto"

export interface PhonePePaymentRequest {
  merchantTransactionId: string
  merchantUserId: string
  amount: number
  redirectUrl: string
  redirectMode: string
  callbackUrl: string
  mobileNumber?: string
  paymentInstrument: {
    type: string
    targetApp?: string
  }
}

export interface PhonePeServiceResponse {
  success: boolean
  code: string
  message: string
  data?: any
}

export class PhonePeService {
  private merchantId: string
  private saltKey: string
  private saltIndex: number
  private environment: "SANDBOX" | "PRODUCTION"
  private apiUrl: string

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || ""
    this.saltKey = process.env.PHONEPE_SALT_KEY || ""
    this.saltIndex = Number.parseInt(process.env.PHONEPE_SALT_INDEX || "1")
    this.environment = (process.env.PHONEPE_ENVIRONMENT || "SANDBOX") as "SANDBOX" | "PRODUCTION"

    // Set API URL based on environment
    this.apiUrl =
      this.environment === "PRODUCTION"
        ? "https://api.phonepe.com/apis/hermes"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox"

    if (!this.merchantId || !this.saltKey) {
      throw new Error("PhonePe configuration is missing. Please check environment variables.")
    }

    console.log(`PhonePe service initialized for ${this.environment} environment`)
  }

  private generateChecksum(payload: string, endpoint: string): string {
    const string = payload + endpoint + this.saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    return sha256 + "###" + this.saltIndex
  }

  private generateStatusChecksum(merchantTransactionId: string): string {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    return sha256 + "###" + this.saltIndex
  }

  async initiatePayment(paymentData: PhonePePaymentRequest): Promise<PhonePeServiceResponse> {
    try {
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: paymentData.merchantTransactionId,
        merchantUserId: paymentData.merchantUserId,
        amount: paymentData.amount * 100, // Convert to paise
        redirectUrl: paymentData.redirectUrl,
        redirectMode: paymentData.redirectMode,
        callbackUrl: paymentData.callbackUrl,
        mobileNumber: paymentData.mobileNumber,
        paymentInstrument: paymentData.paymentInstrument,
      }

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64")
      const checksum = this.generateChecksum(base64Payload, "/pg/v1/pay")

      console.log("Initiating PhonePe payment with payload:", {
        ...payload,
        amount: payload.amount / 100, // Log in rupees for readability
      })

      const response = await fetch(`${this.apiUrl}/pg/v1/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
        body: JSON.stringify({
          request: base64Payload,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("PhonePe API error:", result)
        throw new Error(result.message || "Payment initiation failed")
      }

      console.log("PhonePe payment response:", result)

      return {
        success: result.success,
        code: result.code,
        message: result.message,
        data: result.data,
      }
    } catch (error) {
      console.error("PhonePe payment initiation error:", error)

      if (error instanceof Error) {
        throw new Error(`Failed to initiate PhonePe payment: ${error.message}`)
      }

      throw new Error("Failed to initiate PhonePe payment")
    }
  }

  async checkPaymentStatus(merchantTransactionId: string): Promise<PhonePeServiceResponse> {
    try {
      console.log("Checking PhonePe payment status for:", merchantTransactionId)

      const checksum = this.generateStatusChecksum(merchantTransactionId)

      const response = await fetch(`${this.apiUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": this.merchantId,
          accept: "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("PhonePe status check error:", result)
        throw new Error(result.message || "Status check failed")
      }

      console.log("PhonePe status response:", result)

      return {
        success: result.success,
        code: result.code,
        message: result.message,
        data: result.data,
      }
    } catch (error) {
      console.error("PhonePe status check error:", error)

      if (error instanceof Error) {
        throw new Error(`Failed to check PhonePe payment status: ${error.message}`)
      }

      throw new Error("Failed to check PhonePe payment status")
    }
  }

  verifyCallback(response: string, checksum: string): boolean {
    try {
      const expectedChecksum = this.generateChecksum(response, "")
      const isValid = expectedChecksum === checksum
      console.log("PhonePe callback verification result:", isValid)
      return isValid
    } catch (error) {
      console.error("PhonePe callback verification error:", error)
      return false
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    try {
      const expectedSignature = crypto.createHmac("sha256", this.saltKey).update(JSON.stringify(payload)).digest("hex")

      const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      console.log("PhonePe webhook verification result:", isValid)
      return isValid
    } catch (error) {
      console.error("PhonePe webhook verification error:", error)
      return false
    }
  }

  async refundPayment(
    merchantTransactionId: string,
    originalTransactionId: string,
    amount: number,
  ): Promise<PhonePeServiceResponse> {
    try {
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId,
        originalTransactionId,
        amount: amount * 100, // Convert to paise
      }

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64")
      const checksum = this.generateChecksum(base64Payload, "/pg/v1/refund")

      console.log("Initiating PhonePe refund with payload:", {
        ...payload,
        amount: payload.amount / 100, // Log in rupees for readability
      })

      const response = await fetch(`${this.apiUrl}/pg/v1/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
        body: JSON.stringify({
          request: base64Payload,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("PhonePe refund error:", result)
        throw new Error(result.message || "Refund failed")
      }

      console.log("PhonePe refund response:", result)

      return {
        success: result.success,
        code: result.code,
        message: result.message,
        data: result.data,
      }
    } catch (error) {
      console.error("PhonePe refund error:", error)

      if (error instanceof Error) {
        throw new Error(`Failed to process PhonePe refund: ${error.message}`)
      }

      throw new Error("Failed to process PhonePe refund")
    }
  }

  validateConfiguration(): boolean {
    return !!(this.merchantId && this.saltKey && this.saltIndex)
  }

  getEnvironment(): string {
    return this.environment
  }

  getMerchantId(): string {
    return this.merchantId
  }
}
