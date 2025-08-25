import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Forward request to backend - note: backend certificates API is at /certificates not /api/certificates
    const backendResponse = await fetch('http://localhost:3000/certificates/my-applications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!backendResponse.ok) {
      // Return empty data instead of error to prevent dashboard crashes
      console.warn('Backend certificate API not available, returning empty data')
      return NextResponse.json({ applications: [] })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Certificates API error:', error)
    // Return empty data instead of error to prevent dashboard crashes
    return NextResponse.json({ applications: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const body = await request.json()

    // Forward request to backend - note: backend certificates API is at /certificates not /api/certificates  
    const backendResponse = await fetch('http://localhost:3000/certificates/apply', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text()
      return NextResponse.json(
        { error: 'Failed to create certificate application', details: errorData }, 
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Create certificate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
