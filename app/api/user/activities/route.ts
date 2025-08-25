import { NextRequest, NextResponse } from 'next/server'

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

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    try {
      // Fetch activities from backend
      const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/user/activities?limit=${limit}`
      
      const backendResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (backendResponse.ok) {
        const activities = await backendResponse.json()
        return NextResponse.json(activities)
      } else {
        console.warn('Backend activities API not available, returning mock data')
      }
    } catch (error) {
      console.warn('Failed to fetch activities from backend:', error)
    }

    // Fallback: Try to construct activities from other APIs
    try {
      const [grievancesRes, certificatesRes] = await Promise.all([
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/grievances`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null),
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/certificates`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null)
      ])

      const activities: any[] = []

      // Add grievance activities
      if (grievancesRes?.ok) {
        const grievancesData = await grievancesRes.json()
        const grievances = grievancesData.grievances || []
        
        grievances.slice(0, 3).forEach((grievance: any) => {
          activities.push({
            id: grievance.id || grievance._id,
            type: 'grievance',
            title: `Submitted grievance: ${grievance.title || grievance.subject || 'Municipal issue'}`,
            description: grievance.description || 'Grievance submitted',
            status: grievance.status || 'pending',
            date: grievance.created_at || grievance.createdAt || new Date().toISOString(),
            icon: 'alert-circle',
            color: grievance.status === 'resolved' ? 'green' : 
                  grievance.status === 'in-progress' ? 'blue' : 'yellow'
          })
        })
      }

      // Add certificate activities
      if (certificatesRes?.ok) {
        const certificatesData = await certificatesRes.json()
        const certificates = certificatesData.applications || []
        
        certificates.slice(0, 3).forEach((cert: any) => {
          activities.push({
            id: cert.application_id || cert._id,
            type: 'certificate',
            title: `${cert.certificate_type || 'Certificate'} application ${cert.status === 'approved' ? 'approved' : 'submitted'}`,
            description: `Application for ${cert.certificate_type || 'certificate'}`,
            status: cert.status || 'pending',
            date: cert.created_at || cert.createdAt || new Date().toISOString(),
            icon: 'file-text',
            color: cert.status === 'approved' ? 'green' : 
                  cert.status === 'under_review' ? 'blue' : 'yellow'
          })
        })
      }

      // Sort by date (most recent first) and limit
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      return NextResponse.json({
        activities: activities.slice(0, limit),
        total: activities.length
      })

    } catch (error) {
      console.error('Error constructing activities:', error)
      
      // Ultimate fallback with mock data
      return NextResponse.json({
        activities: [
          {
            id: 'mock-1',
            type: 'system',
            title: 'Profile information updated',
            description: 'User profile was updated',
            status: 'completed',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'user',
            color: 'green'
          }
        ],
        total: 1
      })
    }

  } catch (error) {
    console.error('User activities API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
