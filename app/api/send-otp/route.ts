import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    // Call your FastAPI backend running on port 8000
    const backendRes = await fetch(`http://127.0.0.1:8000/api/auth/send-otp?mobile=${encodeURIComponent(mobile)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();
    
    // Return the response with the same status code as backend
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error calling backend:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' }, 
      { status: 500 }
    );
  }
}
