'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CreditCard, FileText, CheckCircle, Clock, AlertCircle, Receipt } from 'lucide-react'
import PaymentComponent from './payment-component'
import { ServiceFees } from '@/lib/razorpay'

interface CertificateType {
  type: string
  name: string
  description: string
  requirements: string[]
  processingTime: string
  fee: number
}

interface CertificateWithPaymentProps {
  certificateType: CertificateType
  applicationData: any
  onApplicationComplete: (applicationId: string, paymentData: any) => void
  onCancel: () => void
}

export default function CertificateWithPayment({
  certificateType,
  applicationData,
  onApplicationComplete,
  onCancel
}: CertificateWithPaymentProps) {
  const [currentStep, setCurrentStep] = useState<'review' | 'payment' | 'confirmation'>('review')
  const [applicationId] = useState(`${certificateType.type.toUpperCase()}${Date.now()}`)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')
  const [paymentData, setPaymentData] = useState<any>(null)

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    setPaymentStatus('success')
    setCurrentStep('confirmation')
    
    // Call parent callback with application completion
    onApplicationComplete(applicationId, payment)
  }

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus('failed')
    console.error('Payment failed:', error)
  }

  const feeCalculation = ServiceFees.calculateTotal(certificateType.fee)

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'review' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
          }`}>
            1
          </div>
          <span className="font-medium">Review</span>
        </div>
        
        <div className="w-12 h-0.5 bg-muted"></div>
        
        <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 
            paymentStatus === 'success' ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'
          }`}>
            {paymentStatus === 'success' ? <CheckCircle className="h-4 w-4" /> : '2'}
          </div>
          <span className="font-medium">Payment</span>
        </div>
        
        <div className="w-12 h-0.5 bg-muted"></div>
        
        <div className={`flex items-center gap-2 ${currentStep === 'confirmation' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'confirmation' ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'
          }`}>
            {currentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '3'}
          </div>
          <span className="font-medium">Confirmation</span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Details
              </CardTitle>
              <CardDescription>Review your certificate application before payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{certificateType.name}</h4>
                <p className="text-sm text-muted-foreground">{certificateType.description}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Application ID</h4>
                <Badge variant="outline" className="font-mono">{applicationId}</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Submitted Information</h4>
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  {Object.entries(applicationData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Processing Time</h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{certificateType.processingTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment Summary
              </CardTitle>
              <CardDescription>Fee breakdown for your certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Certificate Fee</span>
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
                <div className="flex justify-between font-medium text-lg">
                  <span>Total Amount</span>
                  <span>₹{feeCalculation.totalAmount}</span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment is required to process your certificate application. You will receive a receipt after successful payment.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setCurrentStep('payment')} className="flex-1">
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 'payment' && (
        <div className="flex justify-center">
          <PaymentComponent
            serviceType="certificate"
            serviceId={applicationId}
            amount={certificateType.fee}
            title={certificateType.name}
            description={`Application ID: ${applicationId}`}
            metadata={{
              applicationId,
              certificateType: certificateType.type,
              applicationData
            }}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
          />
        </div>
      )}

      {currentStep === 'confirmation' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>Your certificate application has been submitted and payment processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Application ID:</span>
                <Badge variant="outline" className="font-mono">{applicationId}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment ID:</span>
                <span className="font-mono text-sm">{paymentData?.razorpay_payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount Paid:</span>
                <span className="font-medium">₹{feeCalculation.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge className="bg-green-500">Paid & Submitted</Badge>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your certificate application is now being processed. You will receive updates on your mobile number and email. 
                Expected completion time: {certificateType.processingTime}
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={onCancel}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
