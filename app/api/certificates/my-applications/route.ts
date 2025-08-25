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
      console.warn('Backend certificate applications API not available, returning empty data')
      return NextResponse.json({ 
        certificates: [], 
        total_count: 0, 
        page: 1, 
        total_pages: 0 
      })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Certificate applications API error:', error)
    // Return empty data instead of error to prevent dashboard crashes
    return NextResponse.json({ 
      certificates: [], 
      total_count: 0, 
      page: 1, 
      total_pages: 0 
    })
  }
}
