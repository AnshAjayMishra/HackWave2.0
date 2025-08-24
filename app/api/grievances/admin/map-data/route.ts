import { NextRequest, NextResponse } from 'next/server'

// Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
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

    // Forward to backend API
    const backendUrl = `${BACKEND_URL}/api/grievances/admin/map-data`
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Backend map-data API failed:', response.status)
      // Return mock data if backend is not available
      const mockMapData = {
        success: true,
        grievances: [
          {
            id: '1',
            grievance_id: 'GRV001',
            title: 'Water Supply Issue - Backend Fallback',
            category: 'water_supply',
            status: 'pending',
            priority: 'high',
            location: 'Sector 15, Bhopal',
            address: 'Sector 15, Bhopal, MP',
            ward_number: '15',
            coordinates: [23.2550, 77.4200],
            created_at: '2024-01-15T10:30:00Z',
            user_mobile: '+919876543210'
          }
        ],
        total: 1,
        note: 'Fallback data - backend not available'
      }
      
      return NextResponse.json(mockMapData)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Admin map-data API error:', error)
    
    // Return mock data on error
    const errorFallbackData = {
      success: false,
      error: 'API temporarily unavailable',
      grievances: [
        {
          id: 'error-1',
          grievance_id: 'GRV-ERR001',
          title: 'Sample Grievance - API Error Fallback',
          category: 'other',
          status: 'pending',
          priority: 'medium',
          location: 'Bhopal, MP',
          address: 'Sample Address, Bhopal, MP',
          ward_number: '1',
          coordinates: [23.2599, 77.4126],
          created_at: new Date().toISOString(),
          user_mobile: '+919999999999'
        }
      ],
      total: 1
    }
    
    return NextResponse.json(errorFallbackData)
  }
}
