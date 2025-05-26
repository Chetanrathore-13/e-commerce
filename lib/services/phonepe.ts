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
  }
}

export interface PhonePeResponse {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: string
    responseCode: string
    paymentInstrument: {
      type: string
    }
    instrumentResponse?: {
      redirectInfo?: {
        url: string
        method: string
      }
    }
  }
}

export class PhonePeService {
  private merchantId: string
  private saltKey: string
  private saltIndex: string
  private apiUrl: string

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || ""
    this.saltKey = process.env.PHONEPE_SALT_KEY || ""
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || "1"
    this.apiUrl = process.env.PHONEPE_API_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox"
  }

  private generateChecksum(payload: string): string {
    const string = payload + "/pg/v1/pay" + this.saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    return sha256 + "###" + this.saltIndex
  }

  private generateStatusChecksum(merchantTransactionId: string): string {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    return sha256 + "###" + this.saltIndex
  }

  async initiatePayment(paymentData: PhonePePaymentRequest): Promise<PhonePeResponse> {
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
      const checksum = this.generateChecksum(base64Payload)

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
      return result
    } catch (error) {
      console.error("PhonePe payment initiation error:", error)
      throw new Error("Failed to initiate PhonePe payment")
    }
  }

  async checkPaymentStatus(merchantTransactionId: string): Promise<PhonePeResponse> {
    try {
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
      return result
    } catch (error) {
      console.error("PhonePe status check error:", error)
      throw new Error("Failed to check PhonePe payment status")
    }
  }

  verifyCallback(response: string, checksum: string): boolean {
    try {
      const expectedChecksum =
        crypto
          .createHash("sha256")
          .update(response + this.saltKey)
          .digest("hex") +
        "###" +
        this.saltIndex

      return expectedChecksum === checksum
    } catch (error) {
      console.error("PhonePe callback verification error:", error)
      return false
    }
  }
}
