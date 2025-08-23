import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();

    // Call your FastAPI backend running on port 8000 with query parameters
    const backendRes = await fetch(`http://127.0.0.1:8000/api/auth/verify-otp?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`, {
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
