import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Forward request to backend
    const backendResponse = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: backendResponse.status }
      )
    }

    const backendData = await backendResponse.json()
    
    return NextResponse.json({
      user: backendData.user
    }, { status: 200 })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
