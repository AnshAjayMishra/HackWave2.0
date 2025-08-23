'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement registration API call
    console.log('Registration data:', formData);
    
    // For now, just redirect to dashboard after "registration"
    alert('Registration successful! Welcome to HackWave!');
    router.push('/dash');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-primary flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-primary text-center">
          Complete Your Profile
        </h2>
        
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#1e1e1e] text-primary border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="mt-6 bg-primary hover:bg-primary-light text-black font-bold py-2 px-4 rounded w-full"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}
