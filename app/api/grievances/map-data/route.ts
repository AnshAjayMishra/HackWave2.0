import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Return mock data for development if no auth
      const mockMapData = {
        success: true,
        grievances: [
          {
            id: '1',
            grievance_id: 'GRV001',
            title: 'Water Supply Issue',
            category: 'water_supply',
            status: 'pending',
            priority: 'high',
            location: 'Sector 15, Bhopal',
            address: 'Sector 15, Bhopal, MP',
            ward_number: '15',
            coordinates: [23.2550, 77.4200],
            created_at: '2024-01-15T10:30:00Z',
            user_mobile: '+919876543210'
          },
          {
            id: '2',
            grievance_id: 'GRV002',
            title: 'Road Pothole',
            category: 'roads',
            status: 'resolved',
            priority: 'medium',
            location: 'MP Nagar, Bhopal',
            address: 'MP Nagar Zone 1, Bhopal, MP',
            ward_number: '12',
            coordinates: [23.2400, 77.4100],
            created_at: '2024-01-10T09:15:00Z',
            user_mobile: '+919876543211'
          },
          {
            id: '3',
            grievance_id: 'GRV003',
            title: 'Street Light Not Working',
            category: 'street_lights',
            status: 'in_progress',
            priority: 'low',
            location: 'Arera Colony, Bhopal',
            address: 'Arera Colony, Bhopal, MP',
            ward_number: '8',
            coordinates: [23.2300, 77.4300],
            created_at: '2024-01-12T14:20:00Z',
            user_mobile: '+919876543212'
          },
          {
            id: '4',
            grievance_id: 'GRV004',
            title: 'Garbage Collection Issue',
            category: 'garbage',
            status: 'pending',
            priority: 'urgent',
            location: 'TT Nagar, Bhopal',
            address: 'TT Nagar, Bhopal, MP',
            ward_number: '20',
            coordinates: [23.2450, 77.3950],
            created_at: '2024-01-14T16:45:00Z',
            user_mobile: '+919876543213'
          },
          {
            id: '5',
            grievance_id: 'GRV005',
            title: 'Drainage Problem',
            category: 'drainage',
            status: 'pending',
            priority: 'high',
            location: 'Kolar Road, Bhopal',
            address: 'Kolar Road, Bhopal, MP',
            ward_number: '25',
            coordinates: [23.2650, 77.4250],
            created_at: '2024-01-13T11:30:00Z',
            user_mobile: '+919876543214'
          }
        ],
        total: 5
      }
      
      return NextResponse.json(mockMapData)
    }

    const token = authHeader.substring(7)
    
    // Forward to backend API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/grievances/admin/map-data`
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Return mock data if backend is not available
      const mockMapData = {
        success: true,
        grievances: [
          {
            id: '1',
            grievance_id: 'GRV001',
            title: 'Water Supply Issue',
            category: 'water_supply',
            status: 'pending',
            priority: 'high',
            location: 'Sector 15, Bhopal',
            address: 'Sector 15, Bhopal, MP',
            ward_number: '15',
            coordinates: [23.2550, 77.4200],
            created_at: '2024-01-15T10:30:00Z',
            user_mobile: '+919876543210'
          },
          {
            id: '2',
            grievance_id: 'GRV002',
            title: 'Road Pothole',
            category: 'roads',
            status: 'resolved',
            priority: 'medium',
            location: 'MP Nagar, Bhopal',
            address: 'MP Nagar Zone 1, Bhopal, MP',
            ward_number: '12',
            coordinates: [23.2400, 77.4100],
            created_at: '2024-01-10T09:15:00Z',
            user_mobile: '+919876543211'
          },
          {
            id: '3',
            grievance_id: 'GRV003',
            title: 'Street Light Not Working',
            category: 'street_lights',
            status: 'in_progress',
            priority: 'low',
            location: 'Arera Colony, Bhopal',
            address: 'Arera Colony, Bhopal, MP',
            ward_number: '8',
            coordinates: [23.2300, 77.4300],
            created_at: '2024-01-12T14:20:00Z',
            user_mobile: '+919876543212'
          }
        ],
        total: 3
      }
      
      return NextResponse.json(mockMapData)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Map data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
