import { NextRequest, NextResponse } from 'next/server'

// Transform backend bill to frontend format
function transformBill(bill: any) {
  return {
    id: bill.bill_id || bill._id,
    type: bill.bill_type === 'property_tax' ? 'property' : 
          bill.bill_type === 'water_bill' ? 'water' : 'garbage',
    amount: bill.balance_amount || bill.amount || 0,
    due_date: bill.due_date,
    status: bill.status,
    description: bill.description,
    year: bill.year || new Date().getFullYear().toString(),
    property_id: bill.property_id,
    meter_reading: bill.meter_reading,
    created_at: bill.created_at
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint') || 'summary'
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Forward request to backend
    const backendResponse = await fetch(`http://localhost:3000/revenue/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!backendResponse.ok) {
      // Return empty data instead of error to prevent crashes
      console.warn(`Backend revenue API (${endpoint}) not available, returning empty data`)
      if (endpoint === 'payment-history') {
        return NextResponse.json([])
      }
      return NextResponse.json({ 
        total_pending: 0, 
        total_paid: 0, 
        total_overdue: 0,
        property_taxes: [],
        water_taxes: [],
        garbage_taxes: []
      })
    }

    const data = await backendResponse.json()
    
    // Transform backend data to frontend format if it's the summary endpoint
    if (endpoint === 'summary' && data.bills) {
      const transformedData = {
        total_pending: data.summary?.total_pending || 0,
        total_paid: data.summary?.total_paid || 0,
        total_overdue: data.summary?.total_overdue || 0,
        property_taxes: data.bills.filter((bill: any) => bill.bill_type === 'property_tax').map(transformBill),
        water_taxes: data.bills.filter((bill: any) => bill.bill_type === 'water_bill').map(transformBill),
        garbage_taxes: data.bills.filter((bill: any) => bill.bill_type === 'garbage_fee' || bill.bill_type === 'sewage_fee').map(transformBill)
      }
      return NextResponse.json(transformedData)
    }
    
    return NextResponse.json(data)

  } catch (error) {
    console.error('Revenue API error:', error)
    // Return empty data instead of error to prevent crashes
    return NextResponse.json([])
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

    // Forward request to backend
    const backendResponse = await fetch('http://localhost:3000/revenue/pay', {
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
        { error: 'Failed to process payment', details: errorData }, 
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Payment processing API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
