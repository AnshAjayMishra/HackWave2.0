import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();

  // Call your FastAPI backend
  const backendRes = await fetch('http://0.0.0.0:3000/api/auth/send-otp?mobile=' + encodeURIComponent(mobile), {
    method: 'POST',
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}