'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // TODO: Fetch user data from API using the token
    // For now, just show a basic dashboard
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Welcome to HaveWave Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Appointments</h3>
            <p className="text-gray-300">View and manage your appointments</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              View Appointments
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Profile</h3>
            <p className="text-gray-300">Update your profile information</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              Edit Profile
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Medical Records</h3>
            <p className="text-gray-300">Access your medical records</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              View Records
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Find Doctors</h3>
            <p className="text-gray-300">Search for doctors by specialty</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              Search Doctors
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Book Appointment</h3>
            <p className="text-gray-300">Schedule a new appointment</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              Book Now
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Emergency</h3>
            <p className="text-gray-300">Emergency contact and services</p>
            <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Emergency
            </button>
          </div>
        </div>

        <div className="mt-8 bg-[#121212] p-6 rounded-lg border border-primary">
          <h3 className="text-xl font-semibold mb-4 text-primary">Recent Activity</h3>
          <p className="text-gray-300">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
