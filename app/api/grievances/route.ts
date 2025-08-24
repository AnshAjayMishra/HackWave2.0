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

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '10';
    const skip = searchParams.get('skip') || '0';

    // Build query string
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (category) queryParams.append('category', category);
    queryParams.append('limit', limit);
    queryParams.append('skip', skip);

    // Call FastAPI backend to get user grievances
    const backendRes = await fetch(`${config.apiUrl}/api/grievances/my-grievances?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error fetching user grievances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user grievances' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Call FastAPI backend to create grievance
    const backendRes = await fetch(`${config.apiUrl}/api/grievances/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error creating grievance:', error);
    return NextResponse.json(
      { error: 'Failed to create grievance' },
      { status: 500 }
    );
  }
}
