import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    // Call your FastAPI backend to resend OTP
    const backendRes = await fetch(`${config.api.baseUrl}/api/auth/resend-otp?mobile=${encodeURIComponent(mobile)}`, {
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
      { error: 'Failed to resend OTP' }, 
      { status: 500 }
    );
  }
}
