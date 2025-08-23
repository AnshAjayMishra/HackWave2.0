'use client'; // 👈 Required at the top for client components

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 This is the correct import for App Router

export default function Login() {
  const [mobile, setMobile] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure mobile number has +91 prefix
    const formattedMobile = mobile.startsWith('+91') ? mobile : `+91${mobile}`;

    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: formattedMobile }),
    });

    if (res.ok) {
      // Use encodeURIComponent to properly encode the + sign
      router.push(`/verify-otp?mobile=${encodeURIComponent(formattedMobile)}`);
    } else {
      alert('Failed to send OTP');
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    setMobile(value);
  };

  return (
    <div className="min-h-screen bg-black text-primary flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-primary text-center">
          Login with Mobile Number
        </h2>
        <div className="relative">
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={handleMobileChange}
            required
            className="w-full p-3 pl-12 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={10}
          />
          <span className="absolute left-3 top-3 text-primary">+91</span>
        </div>
        <button
          type="submit"
          className="mt-4 bg-primary hover:bg-primary-light text-black font-bold py-2 px-4 rounded"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
