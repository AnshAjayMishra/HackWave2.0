'use client'

import { useEffect, useState } from 'react'

export default function RazorpayTest() {
  const [envVars, setEnvVars] = useState<{ [key: string]: string }>({})
  
  useEffect(() => {
    // Check environment variables in browser
    const vars = {
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'Not found',
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'Not found',
      NODE_ENV: process.env.NODE_ENV || 'Not found',
    }
    setEnvVars(vars)
  }, [])
  
  const testRazorpay = async (useRealRazorpay = false) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    console.log('Testing Razorpay with key:', keyId)
    
    if (!keyId) {
      alert('Razorpay Key ID not found in environment variables')
      return
    }
    
    try {
      if (useRealRazorpay) {
        // Test with real Razorpay API
        alert('Testing with REAL Razorpay - this will create an actual order and open Razorpay checkout')
        
        // Create a real order via frontend API
        const response = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: 50000, // 500 rupees in paise
            currency: 'INR',
            receipt: 'test_receipt_' + Date.now(),
            description: 'Real Razorpay Test Payment',
            customer: {
              name: 'Test User',
              email: 'test@example.com',
              contact: '9999999999'
            },
            metadata: {
              test: true,
              user_id: 'test_user'
            }
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to create order: ' + response.statusText)
        }
        
        const orderData = await response.json()
        console.log('Order created:', orderData)
        
        // Use the order data directly (frontend API returns order details directly)
        const order = orderData
        
        // Load Razorpay script and open checkout
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const options = {
            key: keyId,
            order_id: order.id || order.order_id,
            amount: order.amount,
            currency: order.currency,
            name: 'Municipal Services',
            description: 'Real Razorpay Test Payment',
            handler: async (response: any) => {
              console.log('Real Payment successful:', response)
              alert('Real Payment successful! Payment ID: ' + response.razorpay_payment_id)
              
              // Verify payment
              try {
                const verifyResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer demo_token'
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                })
                
                const verifyResult = await verifyResponse.json()
                console.log('Payment verification:', verifyResult)
              } catch (error) {
                console.error('Verification error:', error)
              }
            },
            prefill: {
              name: 'Test User',
              email: 'test@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#3B82F6'
            }
          }
          
          const rzp = new (window as any).Razorpay(options)
          rzp.on('payment.failed', (response: any) => {
            console.error('Real Payment failed:', response)
            alert('Payment failed: ' + response.error.description)
          })
          rzp.open()
        }
        document.body.appendChild(script)
        
      } else {
        // Mock payment simulation
        alert('Testing with MOCK payment - this will simulate payment without Razorpay servers')
        setTimeout(() => {
          const mockResponse = {
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_order_id: 'order_mock_' + Date.now(),
            razorpay_signature: 'mock_signature_' + Date.now()
          }
          console.log('Mock payment successful:', mockResponse)
          alert('Mock Payment successful: ' + mockResponse.razorpay_payment_id)
        }, 2000)
      }
      
    } catch (error) {
      console.error('Payment test error:', error)
      alert('Error: ' + error)
    }
  }
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Razorpay Integration Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
        <div className="bg-gray-100 p-4 rounded">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong> <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => testRazorpay(false)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded mr-4"
        >
          Test Mock Payment (No API calls)
        </button>
        
        <button 
          onClick={() => testRazorpay(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Test REAL Razorpay (Live API)
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Mock Payment:</strong> Simulates payment success without any API calls (instant response)</p>
        <p><strong>REAL Razorpay:</strong> Creates actual Razorpay order and opens real checkout (test with real cards)</p>
        <p>For real payments, use test card: <code>4111 1111 1111 1111</code>, any future date, any CVV</p>
        <p>Real payments will actually charge the test card but money isn't debited in test mode</p>
      </div>
    </div>
  )
}
