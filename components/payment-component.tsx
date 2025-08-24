'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CreditCard, Shield, Clock, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import RazorpayService, { PaymentData, ServiceFees } from '@/lib/razorpay'
import { useUser } from '@/contexts/user-context'

interface PaymentComponentProps {
  serviceType: 'certificate' | 'grievance' | 'fine' | 'tax'
  serviceId: string
  amount: number
  title: string
  description: string
  metadata?: any
  onPaymentSuccess: (paymentData: any) => void
  onPaymentFailure: (error: any) => void
  disabled?: boolean
}

export default function PaymentComponent({
  serviceType,
  serviceId,
  amount,
  title,
  description,
  metadata = {},
  onPaymentSuccess,
  onPaymentFailure,
  disabled = false
}: PaymentComponentProps) {
  const { user } = useUser()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const razorpayService = RazorpayService.getInstance()

  // Calculate fees
  const feeCalculation = ServiceFees.calculateTotal(amount)
  
  const handlePayment = async () => {
    if (!user) {
      setError('Please login to make payment')
      return
    }

    try {
      setProcessing(true)
      setError(null)

      // Prepare payment data
      const paymentData: PaymentData = {
        amount: feeCalculation.totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: `${serviceType}_${serviceId}_${Date.now()}`,
        description: `${title} - ${description}`,
        customer: {
          name: user.name || 'Municipal User',
          email: user.email,
          contact: user.mobile
        },
        metadata: {
          service_type: serviceType,
          service_id: serviceId,
          application_id: metadata.applicationId,
          user_id: user._id,
          ...metadata
        }
      }

      // Create Razorpay order
      const order = await razorpayService.createOrder(paymentData)

      // Open Razorpay checkout
      razorpayService.openCheckout({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: title,
        description: description,
        customer: paymentData.customer,
        metadata: paymentData.metadata,
        onSuccess: async (response) => {
          try {
            // Verify payment
            const verified = await razorpayService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verified) {
              onPaymentSuccess({
                ...response,
                order,
                paymentData,
                feeCalculation
              })
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError)
            onPaymentFailure(verificationError)
            setError('Payment verification failed. Please contact support.')
          } finally {
            setProcessing(false)
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error)
          onPaymentFailure(error)
          setError(`Payment failed: ${error.description || 'Unknown error'}`)
          setProcessing(false)
        },
        onDismiss: () => {
          setProcessing(false)
        }
      })

    } catch (error) {
      console.error('Payment initiation error:', error)
      setError('Failed to initiate payment. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your payment to proceed with {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="space-y-2">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Badge variant="outline" className="text-xs">
            {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service
          </Badge>
        </div>

        <Separator />

        {/* Fee Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium">Fee Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Amount</span>
              <span>₹{feeCalculation.baseAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>₹{feeCalculation.processingFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST)</span>
              <span>₹{feeCalculation.tax}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{feeCalculation.totalAmount}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Information */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 mt-0.5 text-green-600" />
          <div>
            <p className="font-medium text-green-600">Secure Payment</p>
            <p>Your payment is processed securely through Razorpay. We don't store your card details.</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          disabled={disabled || processing || !user}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ₹{feeCalculation.totalAmount}
            </>
          )}
        </Button>

        {!user && (
          <p className="text-xs text-center text-muted-foreground">
            Please login to make payment
          </p>
        )}

        {/* Payment Methods */}
        <div className="text-xs text-center text-muted-foreground">
          <p>We accept UPI, Cards, Net Banking & Wallets</p>
        </div>
      </CardContent>
    </Card>
  )
}
