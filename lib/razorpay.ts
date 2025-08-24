// lib/razorpay.ts
import { config } from './config'

export interface PaymentData {
  amount: number // in paise (100 paise = 1 rupee)
  currency: string
  receipt: string
  description: string
  customer: {
    name: string
    email?: string
    contact: string
  }
  metadata?: {
    service_type: 'certificate' | 'grievance' | 'fine' | 'tax'
    service_id: string
    application_id?: string
    [key: string]: any
  }
}

export interface RazorpayOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  created_at: number
}

export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export class RazorpayService {
  private static instance: RazorpayService
  private keyId: string
  private keySecret: string

  private constructor() {
    // Only public key is needed in browser context
    this.keyId = config.payment.razorpay.keyId
    // Secret key should only be used on server side
    this.keySecret = '' // Will be handled by backend API
    
    if (!this.keyId) {
      console.warn('Razorpay Key ID not found in environment variables')
    }
  }

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService()
    }
    return RazorpayService.instance
  }

  public getKeyId(): string {
    return this.keyId
  }

  // Create Razorpay order
  public async createOrder(paymentData: PaymentData): Promise<RazorpayOrderResponse> {
    try {
      // Use backend API for payment processing
      const response = await fetch(`${config.api.backendUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          receipt: paymentData.receipt,
          description: paymentData.description,
          metadata: paymentData.metadata
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to create order: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      
      // Handle both direct order response and wrapped response
      if (result.order) {
        return result.order
      }
      
      return result
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  // Verify payment signature
  public async verifyPayment(verificationData: PaymentVerificationData): Promise<boolean> {
    try {
      // Use backend API for payment verification
      const response = await fetch(`${config.api.backendUrl}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(verificationData)
      })

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result.verified === true
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  // Open Razorpay checkout
  public openCheckout(options: {
    order_id: string
    amount: number
    currency: string
    name: string
    description: string
    customer: {
      name: string
      email?: string
      contact: string
    }
    metadata?: any
    onSuccess: (response: any) => void
    onFailure: (error: any) => void
    onDismiss?: () => void
  }): void {
    if (typeof window === 'undefined') {
      console.error('Razorpay can only be used in browser environment')
      return
    }

    if (!this.keyId) {
      console.error('Razorpay Key ID is not configured')
      options.onFailure(new Error('Payment gateway not configured'))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      try {
        const razorpay = new (window as any).Razorpay({
          key: this.keyId,
          order_id: options.order_id,
          amount: options.amount,
          currency: options.currency,
          name: 'Municipal Services Portal',
          description: options.description,
          image: '/placeholder-logo.png',
          prefill: {
            name: options.customer.name,
            email: options.customer.email || '',
            contact: options.customer.contact
          },
          notes: options.metadata || {},
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: options.onDismiss || (() => {
              console.log('Payment dialog closed')
            })
          },
          handler: (response: any) => {
            console.log('Payment successful:', response)
            options.onSuccess(response)
          }
        })

        razorpay.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response)
          options.onFailure(response.error)
        })

        razorpay.open()
      } catch (error) {
        console.error('Error initializing Razorpay:', error)
        options.onFailure(error)
      }
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script')
      options.onFailure(new Error('Failed to load payment gateway'))
    }
    
    document.body.appendChild(script)
  }

  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || ''
    }
    return ''
  }
}

// Service fee calculations
export const ServiceFees = {
  CERTIFICATE_BIRTH: 50,
  CERTIFICATE_DEATH: 50,
  CERTIFICATE_MARRIAGE: 100,
  GRIEVANCE_URGENT: 100,
  FINE_LATE_FEE: 500,
  BILL_PAYMENT: 10, // Processing fee for bill payments
  
  // Calculate total amount including processing fee and taxes
  calculateTotal: (baseAmount: number, processingFee: number = 10, taxPercent: number = 18): {
    baseAmount: number
    processingFee: number
    tax: number
    totalAmount: number
  } => {
    const tax = Math.round((baseAmount + processingFee) * taxPercent / 100)
    const totalAmount = baseAmount + processingFee + tax
    
    return {
      baseAmount,
      processingFee,
      tax,
      totalAmount
    }
  }
}

export default RazorpayService
