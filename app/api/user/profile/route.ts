import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
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

    // Get request body
    const body = await request.json()

    // Forward request to backend
    const backendResponse = await fetch('http://localhost:3000/api/users/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: backendResponse.status }
      )
    }

    const backendData = await backendResponse.json()
    
    return NextResponse.json({
      success: true,
      user: backendData.user
    }, { status: 200 })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
