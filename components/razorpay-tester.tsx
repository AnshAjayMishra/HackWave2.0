'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CreditCard, TestTube, Database } from 'lucide-react'
import APITestingDashboard from './api-testing-dashboard'

export default function RazorpayTester() {
  const [isTestingMock, setIsTestingMock] = useState(false)
  const [isTestingReal, setIsTestingReal] = useState(false)
  const [lastResult, setLastResult] = useState<string>('')

  const testMockPayment = () => {
    setIsTestingMock(true)
    setLastResult('')
    
    setTimeout(() => {
      const mockResponse = {
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_order_id: 'order_mock_' + Date.now(),
        razorpay_signature: 'mock_signature_' + Date.now()
      }
      
      setLastResult(`Mock Payment Success: ${mockResponse.razorpay_payment_id}`)
      setIsTestingMock(false)
    }, 2000)
  }

  const testRealPayment = async () => {
    setIsTestingReal(true)
    setLastResult('')
    
    try {
      // Create real Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 10000, // ₹100 in paise
          currency: 'INR',
          receipt: 'test_real_' + Date.now(),
          description: 'Real Razorpay Test from Dashboard',
          customer: {
            name: 'Dashboard Test User',
            email: 'test@dashboard.com',
            contact: '9999999999'
          },
          metadata: {
            test: true,
            source: 'dashboard_tester'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      
      // Load and open Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        
        const options = {
          key: keyId,
          order_id: order.id || order.order_id,
          amount: order.amount,
          currency: order.currency,
          name: 'Dashboard Test',
          description: 'Real Razorpay Test Payment',
          handler: (response: any) => {
            setLastResult(`Real Payment Success: ${response.razorpay_payment_id}`)
            setIsTestingReal(false)
          },
          prefill: {
            name: 'Dashboard Test User',
            email: 'test@dashboard.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: () => {
              setLastResult('Payment cancelled by user')
              setIsTestingReal(false)
            }
          }
        }
        
        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', (response: any) => {
          setLastResult(`Payment Failed: ${response.error.description}`)
          setIsTestingReal(false)
        })
        rzp.open()
      }
      
      script.onerror = () => {
        setLastResult('Failed to load Razorpay script')
        setIsTestingReal(false)
      }
      
      document.body.appendChild(script)
      
    } catch (error) {
      setLastResult(`Error: ${error}`)
      setIsTestingReal(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Testing
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            API Testing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Razorpay Payment Testing
              </CardTitle>
              <CardDescription>
                Test both mock and real Razorpay payment integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Mock Payment Test */}
              <div className="space-y-3">
                <h3 className="font-semibold">Mock Payment Test</h3>
                <p className="text-sm text-gray-600">
                  Simulates payment success without API calls (for development)
                </p>
                <Button 
                  onClick={testMockPayment}
                  disabled={isTestingMock}
                  variant="outline"
                  className="w-full"
                >
                  {isTestingMock ? 'Testing Mock Payment...' : 'Test Mock Payment'}
                </Button>
              </div>

              {/* Real Payment Test */}
              <div className="space-y-3">
                <h3 className="font-semibold">Real Razorpay Test</h3>
                <p className="text-sm text-gray-600">
                  Creates actual Razorpay order and opens real checkout (₹100 test amount)
                </p>
                <Button 
                  onClick={testRealPayment}
                  disabled={isTestingReal}
                  className="w-full"
                >
                  {isTestingReal ? 'Creating Order...' : 'Test Real Razorpay (₹100)'}
                </Button>
                <Alert>
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    Use test card: <code>4111 1111 1111 1111</code>, any future date, any CVV
                  </AlertDescription>
                </Alert>
              </div>

              {/* Results */}
              {lastResult && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Last Result:</strong> {lastResult}
                  </AlertDescription>
                </Alert>
              )}

              {/* Test Cards Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Test Cards:</strong></p>
                <p>Success: 4111 1111 1111 1111</p>
                <p>Failure: 4000 0000 0000 0002</p>
                <p>All amounts are in test mode - no real money is charged</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <APITestingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
