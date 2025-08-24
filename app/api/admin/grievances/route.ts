import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' }, 
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const limit = url.searchParams.get('limit') || '50';
    const skip = url.searchParams.get('skip') || '0';

    // Build query string
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (category) queryParams.append('category', category);
    if (priority) queryParams.append('priority', priority);
    queryParams.append('limit', limit);
    queryParams.append('skip', skip);

    const backendRes = await fetch(`${config.apiUrl}/api/grievances/admin/all?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await backendRes.json();
    
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error calling backend admin grievances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin grievances' }, 
      { status: 500 }
    );
  }
}
