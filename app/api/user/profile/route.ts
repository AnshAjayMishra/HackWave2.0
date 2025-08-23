import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function PUT(req: NextRequest) {
  try {
    const profileData = await req.json();
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Call FastAPI backend to update profile
    const backendRes = await fetch(`${config.apiUrl}/api/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(profileData),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
