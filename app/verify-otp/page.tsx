"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/contexts/user-context"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

function VerifyOTPContent() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { verifyOTP } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mobile = searchParams.get('mobile') || ''

  useEffect(() => {
    if (!mobile) {
      router.push('/login')
    }
  }, [mobile, router])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await verifyOTP(mobile, otp)
      
      if (!result.success) {
        setError('Invalid OTP. Please try again.')
      }
      // Navigation is handled by the context
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Verify OTP</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter the OTP sent to {mobile}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Verification Code
            </CardTitle>
            <CardDescription>
              Please check your SMS for the 6-digit code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-lg py-3 text-center tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-3 text-lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}