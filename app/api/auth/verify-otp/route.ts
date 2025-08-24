import { NextRequest, NextResponse } from 'next/server'

// Verify OTP and complete login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mobile, otp } = body

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      )
    }

    // Ensure mobile number is in correct format
    let formattedMobile = mobile.toString().trim()
    
    // Remove any existing +91 prefix or 91 prefix
    if (formattedMobile.startsWith('+91')) {
      formattedMobile = formattedMobile.substring(3)
    } else if (formattedMobile.startsWith('91')) {
      formattedMobile = formattedMobile.substring(2)
    }
    
    // Add +91 prefix for Indian numbers
    formattedMobile = `+91${formattedMobile}`

    // Forward request to backend with mobile and otp as query parameters
    const backendResponse = await fetch(`http://localhost:3000/api/auth/verify-otp?mobile=${encodeURIComponent(formattedMobile)}&otp=${encodeURIComponent(otp)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const backendData = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: backendData.detail || 'OTP verification failed' },
        { status: backendResponse.status }
      )
    }

    // Return success with token
    return NextResponse.json({
      success: true,
      token: backendData.token,
      user: backendData.user,
      message: 'Login successful'
    }, { status: 200 })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
