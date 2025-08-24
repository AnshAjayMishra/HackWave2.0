import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' }, 
        { status: 401 }
      );
    }

    // Call the backend admin stats endpoint
    const backendRes = await fetch(`${config.apiUrl}/api/grievances/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await backendRes.json();
    
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error calling backend admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' }, 
      { status: 500 }
    );
  }
}
