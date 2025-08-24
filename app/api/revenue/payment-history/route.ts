import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Forward to backend API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/payment-history`
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Return mock payment history if backend is not available
      const mockHistory = [
        {
          id: 'pay_001',
          tax_id: 'prop_002',
          amount: 8500,
          payment_date: '2023-11-15T10:30:00Z',
          payment_method: 'online',
          transaction_id: 'TXN123456789',
          status: 'success'
        },
        {
          id: 'pay_002',
          tax_id: 'water_prev',
          amount: 2800,
          payment_date: '2024-07-10T14:20:00Z',
          payment_method: 'online',
          transaction_id: 'TXN987654321',
          status: 'success'
        }
      ]
      
      return NextResponse.json(mockHistory)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Payment history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
