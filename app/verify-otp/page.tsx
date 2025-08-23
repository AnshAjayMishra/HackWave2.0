'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });

    if (res.ok) {
      alert('OTP verified! Logged in.');
      router.push('/dashboard');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-black text-teal flex items-center justify-center">
      <form
        onSubmit={handleVerify}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-teal text-center">
          Enter OTP
        </h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-3 bg-[#1e1e1e] text-teal border border-teal rounded-md focus:outline-none focus:ring-2 focus:ring-teal-light"
        />
        <button
          type="submit"
          className="mt-4 bg-teal hover:bg-teal-light text-black font-bold py-2 px-4 rounded"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
