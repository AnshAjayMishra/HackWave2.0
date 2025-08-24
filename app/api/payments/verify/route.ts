// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      console.error('Razorpay key secret not configured')
      return NextResponse.json(
        { error: 'Payment verification not configured' },
        { status: 500 }
      )
    }

    // Generate signature for verification
    const body_string = razorpay_order_id + '|' + razorpay_payment_id
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(body_string)
      .digest('hex')

    // Verify signature
    const verified = generated_signature === razorpay_signature

    if (verified) {
      // Here you can add logic to update your database
      // Mark the order as paid, update application status, etc.
      
      return NextResponse.json({
        success: true,
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Payment verification failed',
          verified: false
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
