import { NextRequest, NextResponse } from 'next/server'

// Configuration - inline to avoid module import issues
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  try {
    // Call FastAPI backend to get grievance categories (public endpoint)
    const backendRes = await fetch(`${BACKEND_URL}/api/grievances/categories`, {
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
