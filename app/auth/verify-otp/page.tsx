'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp: enteredOtp }),
    });

    if (res.ok) {
      alert('OTP verified! Logged in.');
      router.push('/dashboard');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-black text-teal-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-teal-400 text-center">
          Enter OTP
        </h2>
        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-12 text-center text-teal-400 text-xl bg-[#1e1e1e] border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-teal-500 hover:bg-teal-400 text-black font-bold py-2 px-4 rounded"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
