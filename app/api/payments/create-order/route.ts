// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { config } from '@/lib/config'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, receipt, description, customer, metadata } = body

    // Validate required fields
    if (!amount || !currency || !receipt || !customer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: receipt,
      notes: {
        service_type: metadata?.service_type || '',
        service_id: metadata?.service_id || '',
        application_id: metadata?.application_id || '',
        user_id: metadata?.user_id || '',
        customer_name: customer.name,
        customer_contact: customer.contact,
        ...metadata
      }
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      ...order
    })

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
