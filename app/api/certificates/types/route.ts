import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Forward request to backend - note: backend certificates API is at /certificates not /api/certificates
    const backendResponse = await fetch('http://localhost:3000/certificates/types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!backendResponse.ok) {
      console.warn('Backend certificate types API not available, returning mock data')
      // Return mock data if backend is not available
      const mockTypes = {
        certificate_types: [
          {
            type: 'birth',
            name: 'Birth Certificate',
            description: 'Official document certifying the birth of a person',
            requirements: [
              'Hospital birth record',
              'Parents identity proof',
              'Address proof',
              'Application form'
            ],
            processing_time: '7-10 working days',
            fee: 50
          },
          {
            type: 'death',
            name: 'Death Certificate',
            description: 'Official document certifying the death of a person',
            requirements: [
              'Medical certificate of death',
              'Identity proof of deceased',
              'Applicant identity proof',
              'Address proof'
            ],
            processing_time: '5-7 working days',
            fee: 50
          },
          {
            type: 'marriage',
            name: 'Marriage Certificate',
            description: 'Official document certifying the marriage between two individuals',
            requirements: [
              'Marriage registration form',
              'Identity proof of both parties',
              'Age proof of both parties',
              'Address proof',
              'Photographs',
              'Witness identity proofs'
            ],
            processing_time: '10-15 working days',
            fee: 100
          }
        ]
      }
      return NextResponse.json(mockTypes)
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Certificate types API error:', error)
    // Return mock data on error
    const mockTypes = {
      certificate_types: [
        {
          type: 'birth',
          name: 'Birth Certificate',
          description: 'Official document certifying the birth of a person',
          requirements: ['Hospital birth record', 'Parents identity proof'],
          processing_time: '7-10 working days',
          fee: 50
        }
      ]
    }
    return NextResponse.json(mockTypes)
  }
}
