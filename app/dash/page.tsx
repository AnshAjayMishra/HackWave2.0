'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/app/contexts/user-context';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-primary flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className="text-gray-300 mt-2">
              Mobile: {user?.mobile}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="mb-8 bg-[#121212] p-6 rounded-lg border border-primary">
          <h3 className="text-xl font-semibold mb-4 text-primary">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300"><strong>Name:</strong> {user?.name || 'Not provided'}</p>
              <p className="text-gray-300"><strong>Email:</strong> {user?.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-300"><strong>Age:</strong> {user?.age || 'Not provided'}</p>
              <p className="text-gray-300"><strong>Location:</strong> {user?.location || 'Not provided'}</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/register')}
            className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Grievances</h3>
            <p className="text-gray-300">Submit and track your municipal grievances</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              View Grievances
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Submit Grievance</h3>
            <p className="text-gray-300">Report a new municipal issue</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              Submit New
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Municipal Services</h3>
            <p className="text-gray-300">Explore available municipal services</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              View Services
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">My Documents</h3>
            <p className="text-gray-300">Manage your documents and certificates</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              View Documents
            </button>
          </div>

          <div className="bg-[#121212] p-6 rounded-lg border border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary">Revenue Services</h3>
            <p className="text-gray-300">Tax payments and revenue related services</p>
            <button className="mt-4 bg-primary hover:bg-primary-light text-black px-4 py-2 rounded">
              Access Services
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
