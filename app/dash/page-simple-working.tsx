"use client"

import { useUser } from '@/contexts/user-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SimpleDashboard() {
  const { user, isLoading, logout } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name || 'User'}!</h1>
              <p className="text-gray-600 mt-2">Dashboard is working</p>
            </div>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name || 'Not set'}</p>
              <p><strong>Email:</strong> {user.email || 'Not set'}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
              <p><strong>City:</strong> {user.city || 'Not set'}</p>
              <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                File Grievance
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Apply for Certificate
              </button>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
                Pay Bills
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
