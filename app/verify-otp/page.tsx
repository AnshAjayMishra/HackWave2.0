'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Properly decode the mobile number from URL
  const mobile = searchParams.get('mobile') ? decodeURIComponent(searchParams.get('mobile')!) : '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Store the JWT token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Check if user needs to complete profile
        // If user doesn't have name or email, redirect to register
        const user = data.user;
        const needsProfileCompletion = !user?.name || !user?.email;

        if (needsProfileCompletion) {
          // Redirect to register page for profile completion
          router.push('/register');
        } else {
          // Redirect to dashboard for existing users with complete profiles
          router.push('/dash');
        }
      } else {
        const errorData = await res.json();
        alert(errorData.detail || errorData.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      if (res.ok) {
        alert('OTP sent successfully!');
      } else {
        alert('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-primary flex items-center justify-center">
      <form
        onSubmit={handleVerify}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-primary text-center">
          Enter OTP sent to {mobile}
        </h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          className="w-full p-3 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-light text-black font-bold py-2 px-4 rounded mb-4 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
        
        <button
          type="button"
          onClick={handleResendOTP}
          className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-black font-bold py-2 px-4 rounded"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}
