"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestAdmin() {
  const [token, setToken] = useState('')
  const router = useRouter()

  const setAuthToken = () => {
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTliZTJkZjE4ZTRiMTFkZWI1NDUzYiIsImV4cCI6MTczMjUzNjQwM30.6Ftn3cNVhJGdYlX0nQ7mofnbkUEqbz3sZdGt2lq26WI"
    localStorage.setItem('authToken', testToken)
    setToken(testToken)
    alert('Token set! Redirecting to admin...')
    router.push('/admin')
  }

  const clearToken = () => {
    localStorage.removeItem('authToken')
    setToken('')
    alert('Token cleared!')
  }

  useEffect(() => {
    const existingToken = localStorage.getItem('authToken')
    if (existingToken) {
      setToken(existingToken)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 p-6 bg-card rounded-lg border">
        <h1 className="text-2xl font-bold text-center">Test Admin Authentication</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Token:</label>
            <p className="text-xs bg-muted p-2 rounded mt-1 break-all">
              {token || 'No token set'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={setAuthToken}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Set Test Token
            </button>
            <button 
              onClick={clearToken}
              className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90"
            >
              Clear Token
            </button>
          </div>
          
          <button 
            onClick={() => router.push('/admin')}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
          >
            Go to Admin Panel
          </button>
          
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-muted/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}
