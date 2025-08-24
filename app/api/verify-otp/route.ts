import { NextRequest, NextResponse } from 'next/server'

// Configuration - inline to avoid module import issues
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();

    // Call your FastAPI backend with query parameters
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/verify-otp?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error calling backend:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' }, 
      { status: 500 }
    );
  }
}
