import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('application_id')
    const paymentId = searchParams.get('payment_id')
    const paymentStatus = searchParams.get('payment_status')

    if (!applicationId || !paymentId || !paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required parameters: application_id, payment_id, payment_status' },
        { status: 400 }
      )
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Forward request to backend with query parameters
    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/certificates/payment/update?application_id=${applicationId}&payment_id=${paymentId}&payment_status=${paymentStatus}`
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Backend expects query parameters, not body
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend payment update error:', errorText)
      return NextResponse.json(
        { error: 'Failed to update payment status in backend' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result
    })

  } catch (error) {
    console.error('Payment update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error during payment update' },
      { status: 500 }
    )
  }
}
