import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const body = await request.json()

    // Forward request to backend - determine certificate type from body
    const certificateType = body.certificate_type || 'birth'
    const backendUrl = `http://localhost:3000/certificates/apply/${certificateType}`

    console.log('Forwarding certificate application to:', backendUrl)
    console.log('Request body:', JSON.stringify(body, null, 2))

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend certificate application error:', errorText)
      return NextResponse.json(
        { error: 'Failed to create certificate application', details: errorText }, 
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    console.log('Certificate application created successfully:', data)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Certificate application API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    )
  }
}
