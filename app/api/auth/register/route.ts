import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, mobile, city, address, gender } = body

    // TODO: Implement actual user registration logic
    // 1. Validate input data
    // 2. Check if user already exists
    // 3. Hash password if you're adding one
    // 4. Save user to database
    // 5. Generate authentication token
    // 6. Set cookie with token

    // Mock response for now
    const mockUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      mobile,
      city,
      address,
      gender,
      createdAt: new Date().toISOString()
    }

    // Mock setting auth cookie
    const response = NextResponse.json(mockUser, { status: 201 })
    response.cookies.set('auth-token', 'mock_token_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 