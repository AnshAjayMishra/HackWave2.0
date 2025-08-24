import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Forward to backend API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/summary`
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Return mock data if backend is not available
      const mockSummary = {
        total_pending: 15500,
        total_paid: 8500,
        total_overdue: 3200,
        property_taxes: [
          {
            id: 'prop_001',
            type: 'property',
            amount: 12000,
            due_date: '2024-12-31',
            status: 'pending',
            description: 'Annual Property Tax 2024',
            year: '2024',
            property_id: 'PROP123456',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 'prop_002',
            type: 'property',
            amount: 8500,
            due_date: '2023-12-31',
            status: 'paid',
            description: 'Annual Property Tax 2023',
            year: '2023',
            property_id: 'PROP123456',
            created_at: '2023-01-01T00:00:00Z'
          }
        ],
        water_taxes: [
          {
            id: 'water_001',
            type: 'water',
            amount: 2500,
            due_date: '2024-09-15',
            status: 'pending',
            description: 'Water Bill - August 2024',
            year: '2024',
            meter_reading: 1250,
            created_at: '2024-08-01T00:00:00Z'
          },
          {
            id: 'water_002',
            type: 'water',
            amount: 3200,
            due_date: '2024-08-15',
            status: 'overdue',
            description: 'Water Bill - July 2024',
            year: '2024',
            meter_reading: 1180,
            created_at: '2024-07-01T00:00:00Z'
          }
        ],
        garbage_taxes: [
          {
            id: 'garbage_001',
            type: 'garbage',
            amount: 1000,
            due_date: '2024-09-30',
            status: 'pending',
            description: 'Waste Management Fee - September 2024',
            year: '2024',
            created_at: '2024-09-01T00:00:00Z'
          }
        ]
      }
      
      return NextResponse.json(mockSummary)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Revenue summary API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
