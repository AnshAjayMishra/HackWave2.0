'use client'; // 👈 Required at the top for client components

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 This is the correct import for App Router

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
    <div className="min-h-screen bg-black text-teal flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-teal text-center">
          Login with Mobile Number
        </h2>
        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full p-3 bg-[#1e1e1e] text-teal border border-teal rounded-md focus:outline-none focus:ring-2 focus:ring-teal-light"
        />
        <button
          type="submit"
          className="mt-4 bg-teal hover:bg-teal-light text-black font-bold py-2 px-4 rounded"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
