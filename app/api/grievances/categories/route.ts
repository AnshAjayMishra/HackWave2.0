import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(req: NextRequest) {
  try {
    // Call FastAPI backend to get grievance categories (public endpoint)
    const backendRes = await fetch(`${config.apiUrl}/api/grievances/categories`, {
      method: 'GET',
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error fetching grievance categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grievance categories' },
      { status: 500 }
    );
  }
}
