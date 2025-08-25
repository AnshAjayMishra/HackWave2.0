import { NextRequest, NextResponse } from 'next/server'

// Helper functions for bill transformation
function getBillTitle(billType: string): string {
  switch (billType) {
    case 'property_tax':
      return 'Property Tax 2024-25'
    case 'water_bill':
      return 'Water & Sewerage Charges'
    case 'garbage_fee':
      return 'Garbage Collection Fee'
    case 'sewage_fee':
      return 'Sewage Treatment Fee'
    default:
      return 'Municipal Fee'
  }
}

function getBillDescription(billType: string): string {
  switch (billType) {
    case 'property_tax':
      return 'Annual property tax assessment'
    case 'water_bill':
      return 'Water and sewerage charges'
    case 'garbage_fee':
      return 'Garbage collection and disposal fee'
    case 'sewage_fee':
      return 'Sewage treatment and disposal fee'
    default:
      return 'Municipal service fee'
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Forward request to backend for real data
    try {
      const backendResponse = await fetch('http://localhost:3000/revenue/summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        console.log('Backend bills data:', backendData)
        
        // Transform backend data to match frontend Bill interface
        const transformedBills = []
        const statistics = {
          totalPending: backendData.summary?.total_pending || 0,
          totalPaid: backendData.summary?.total_paid || 0,
          overdue: backendData.summary?.total_overdue || 0,
          totalBills: 0
        }

        // Transform different bill types
        if (backendData.bills) {
          for (const bill of backendData.bills) {
            const transformedBill: any = {
              id: bill.bill_id || bill._id,
              type: bill.bill_type,
              title: getBillTitle(bill.bill_type),
              description: bill.description || getBillDescription(bill.bill_type),
              amount: bill.balance_amount || bill.amount || 0,
              dueDate: bill.due_date,
              status: bill.status,
              billNumber: bill.bill_number || `${bill.bill_type.toUpperCase()}/${new Date().getFullYear()}/${transformedBills.length + 1}`,
              propertyId: bill.property_id,
              address: bill.address || '123 Main Street, Downtown Area',
              period: bill.year || new Date().getFullYear().toString()
            }
            transformedBills.push(transformedBill)
          }
        }

        statistics.totalBills = transformedBills.length

        return NextResponse.json({
          success: true,
          bills: transformedBills,
          statistics,
          message: 'Bills fetched successfully'
        })
      }
    } catch (backendError) {
      console.warn('Backend not available, using fallback data:', backendError)
    }

    // Fallback to mock data if backend is not available
    const mockBills = [
      {
        id: 'BILL_001',
        type: 'property_tax',
        title: 'Property Tax 2024-25',
        description: 'Annual property tax for property ID: PROP123',
        amount: 15000,
        dueDate: '2024-12-31',
        status: 'pending',
        billNumber: 'PT/2024/001',
        propertyId: 'PROP123',
        address: '123 Main Street, Downtown Area, Mumbai',
        assessmentYear: '2024-25'
      },
      {
        id: 'BILL_002',
        type: 'water_bill',
        title: 'Water & Sewerage Charges',
        description: 'Water and sewerage charges for Q3 2024',
        amount: 2500,
        dueDate: '2024-11-15',
        status: 'pending',
        billNumber: 'WS/2024/Q3/001',
        connectionId: 'WC123456',
        address: '123 Main Street, Downtown Area, Mumbai',
        period: 'July - September 2024'
      },
      {
        id: 'BILL_003',
        type: 'garbage_fee',
        title: 'Garbage Collection Fee',
        description: 'Monthly garbage collection and disposal fee',
        amount: 5000,
        dueDate: '2024-10-30',
        status: 'overdue',
        billNumber: 'GC/2024/001',
        licenseNumber: 'TL123456',
        businessName: 'ABC Trading Co.',
        period: '2024-25'
      }
    ]

    // Mock bill statistics
    const statistics = {
      totalPending: mockBills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0),
      totalPaid: 0, // Would come from paid bills
      overdue: mockBills.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0),
      totalBills: mockBills.length
    }

    return NextResponse.json({
      success: true,
      bills: mockBills,
      statistics,
      message: 'Bills fetched successfully (fallback data)'
    })

  } catch (error) {
    console.error('Bills API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const body = await request.json()

    const { billId, paymentMethod = 'razorpay' } = body

    if (!billId) {
      return NextResponse.json(
        { error: 'Bill ID is required' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Validate the bill exists and belongs to user
    // 2. Create payment order with Razorpay
    // 3. Return payment details for frontend processing

    // Mock payment order creation
    const paymentOrder = {
      orderId: `order_${Date.now()}`,
      amount: 15000, // This would come from the actual bill
      currency: 'INR',
      billId: billId,
      description: 'Municipal Bill Payment'
    }

    return NextResponse.json({
      success: true,
      paymentOrder,
      message: 'Payment order created successfully'
    })

  } catch (error) {
    console.error('Bill payment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
