"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  mobile: string
  verified: boolean
  name?: string
  email?: string
  age?: number
  gender?: string
  location?: string
  city?: string
  address?: string
  createdAt?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  sendOTP: (mobile: string) => Promise<boolean>
  verifyOTP: (mobile: string, otp: string) => Promise<{ success: boolean; needsProfile?: boolean }>
  register: (userData: Partial<User>) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  getAuthToken: () => string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  const checkAuth = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
          localStorage.removeItem('authToken')
        }
      } else {
        setUser(null)
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const sendOTP = async (mobile: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      })

      return response.ok
    } catch (error) {
      console.error('OTP send error:', error)
      return false
    }
  }

  const verifyOTP = async (mobile: string, otp: string): Promise<{ success: boolean; needsProfile?: boolean }> => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.token) {
          localStorage.setItem('authToken', data.token)
        }

        if (data.user) {
          setUser(data.user)
          
          // Check if user profile is complete (name and email are required for a complete profile)
          // A new user created from OTP verification will have undefined/null values for these fields
          const hasName = data.user.name && data.user.name.trim() !== ''
          const hasEmail = data.user.email && data.user.email.trim() !== ''
          const needsProfile = !hasName || !hasEmail
          
          if (needsProfile) {
            router.push('/register')
          } else {
            router.push('/dash')
          }
          
          return { success: true, needsProfile }
        }
        
        return { success: true, needsProfile: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('OTP verification error:', error)
      return { success: false }
    }
  }

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const token = getAuthToken()
      if (!token) {
        return false
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          router.push('/dash')
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const token = getAuthToken()
      if (!token) {
        return false
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('authToken')
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    sendOTP,
    verifyOTP,
    register,
    updateProfile,
    logout,
    checkAuth,
    getAuthToken
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 