'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });

    if (res.ok) {
      router.push(`/verify-otp?mobile=${mobile}`);
    } else {
      alert('Failed to send OTP');
    }
  };

  return (
    <div className="min-h-screen bg-black text-teal-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-teal-400 text-center">
          Login with Mobile Number
        </h2>
        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full p-3 bg-[#1e1e1e] text-teal-400 border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        <button
          type="submit"
          className="mt-4 bg-teal-500 hover:bg-teal-400 text-black font-bold py-2 px-4 rounded"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
