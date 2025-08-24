'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Zap, Clock, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react'
import PaymentComponent from './payment-component'
import { ServiceFees } from '@/lib/razorpay'

interface Grievance {
  id: string
  title: string
  description: string
  category: string
  categoryName: string
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  createdAt: string
}

interface GrievancePriorityPaymentProps {
  grievance: Grievance
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (grievanceId: string, paymentData: any) => void
}

export default function GrievancePriorityPayment({
  grievance,
  isOpen,
  onClose,
  onPaymentSuccess
}: GrievancePriorityPaymentProps) {
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'success'>('info')
  const [paymentData, setPaymentData] = useState<any>(null)

  const priorityFee = ServiceFees.GRIEVANCE_URGENT
  const feeCalculation = ServiceFees.calculateTotal(priorityFee)

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    setPaymentStep('success')
    onPaymentSuccess(grievance.id, payment)
  }

  const handlePaymentFailure = (error: any) => {
    console.error('Priority payment failed:', error)
  }

  const resetDialog = () => {
    setPaymentStep('info')
    setPaymentData(null)
    onClose()
  }

  const priorityBenefits = [
    'Escalated to urgent status immediately',
    'Assigned to senior officials',
    'Faster resolution timeline (24-48 hours)',
    'Real-time SMS/email updates',
    'Direct contact with assigned officer',
    'Priority over regular grievances'
  ]

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Upgrade to Priority Processing
          </DialogTitle>
          <DialogDescription>
            Fast-track your grievance for immediate attention and faster resolution
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'info' && (
          <div className="space-y-6">
            {/* Grievance Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grievance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Title: </span>
                  <span>{grievance.title}</span>
                </div>
                <div>
                  <span className="font-medium">Category: </span>
                  <Badge variant="outline">{grievance.categoryName}</Badge>
                </div>
                <div>
                  <span className="font-medium">Current Status: </span>
                  <Badge variant="secondary">{grievance.status}</Badge>
                </div>
                <div>
                  <span className="font-medium">Current Priority: </span>
                  <Badge variant="outline">{grievance.priority}</Badge>
                </div>
                <div>
                  <span className="font-medium">Location: </span>
                  <span className="text-sm text-muted-foreground">{grievance.location.address}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Priority Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Zap className="h-5 w-5" />
                    Priority Processing Benefits
                  </CardTitle>
                  <CardDescription>What you get with priority processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priorityBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Timeline</CardTitle>
                  <CardDescription>Compare regular vs priority processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Regular Processing</span>
                      </div>
                      <span className="text-sm text-muted-foreground">7-15 days</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-orange-700">Priority Processing</span>
                      </div>
                      <span className="text-sm font-medium text-orange-700">24-48 hours</span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Priority processing is recommended for urgent issues that require immediate attention.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Fee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Priority Processing Fee
                </CardTitle>
                <CardDescription>One-time fee to upgrade your grievance to priority status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Priority Processing Fee</span>
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

                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setPaymentStep('payment')} className="flex-1">
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {paymentStep === 'payment' && (
          <div className="flex justify-center py-6">
            <PaymentComponent
              serviceType="grievance"
              serviceId={grievance.id}
              amount={priorityFee}
              title="Priority Grievance Processing"
              description={`Upgrade grievance: ${grievance.title}`}
              metadata={{
                grievanceId: grievance.id,
                originalPriority: grievance.priority,
                upgradeType: 'priority'
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Priority Upgrade Successful!</h3>
              <p className="text-muted-foreground">Your grievance has been upgraded to priority status</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Grievance ID:</span>
                    <Badge variant="outline" className="font-mono">{grievance.id}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment ID:</span>
                    <span className="font-mono text-sm">{paymentData?.razorpay_payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">New Priority:</span>
                    <Badge className="bg-orange-500">Urgent</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expected Resolution:</span>
                    <span className="font-medium text-green-600">24-48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your grievance has been escalated to our priority queue. You will receive an SMS/email confirmation shortly 
                with the assigned officer details and expected resolution timeline.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={resetDialog}>
                Back to Grievances
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
