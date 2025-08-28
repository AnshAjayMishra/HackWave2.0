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

    const url = new URL(req.url);
    const q = url.searchParams.get('q');
    const limit = url.searchParams.get('limit') || '20';

    if (!q) {
      return NextResponse.json(
        { error: 'Search query is required' }, 
        { status: 400 }
      );
    }

    const queryParams = new URLSearchParams();
    queryParams.append('q', q);
    queryParams.append('limit', limit);

    const backendRes = await fetch(`${config.apiUrl}/api/grievances/admin/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await backendRes.json();
    
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error calling backend search grievances:', error);
    return NextResponse.json(
      { error: 'Failed to search grievances' }, 
      { status: 500 }
    );
  }
}
