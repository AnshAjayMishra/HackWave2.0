// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const generated_signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (generated_signature !== signature) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    
    // Handle different payment events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log('Payment captured:', payment.id)
  
  // Update your database here
  // - Mark certificate application as paid
  // - Update grievance status if it was a priority fee
  // - Send confirmation email/SMS
  
  const notes = payment.notes || {}
  const serviceType = notes.service_type
  const serviceId = notes.service_id
  const applicationId = notes.application_id

  if (serviceType === 'certificate' && applicationId) {
    // Update certificate application status
    console.log(`Updating certificate application ${applicationId} status to paid`)
    // Call your backend API to update status
  }
  
  if (serviceType === 'grievance' && serviceId) {
    // Update grievance priority status
    console.log(`Updating grievance ${serviceId} to priority status`)
    // Call your backend API to update priority
  }
}

async function handlePaymentFailed(payment: any) {
  console.log('Payment failed:', payment.id)
  
  // Handle failed payment
  // - Send notification to user
  // - Reset application status if needed
  
  const notes = payment.notes || {}
  console.log('Failed payment details:', notes)
}

async function handleOrderPaid(order: any) {
  console.log('Order paid:', order.id)
  
  // Additional order completion logic
  const notes = order.notes || {}
  console.log('Paid order details:', notes)
}
