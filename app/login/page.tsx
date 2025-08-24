"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { sendOTP, verifyOTP } = useUser()
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid mobile number')
      return
    }

    setIsLoading(true)
    
    try {
      const success = await sendOTP(mobile)
      
      if (success) {
        setSuccess('OTP sent successfully!')
        setStep('otp')
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
      
      if (result.success) {
        // The context will handle navigation to dashboard or register
        // based on whether profile is complete
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold flex items-center">
              {step === 'phone' ? (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Phone Number
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Verify OTP
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'We\'ll send you a verification code'
                : `Code sent to ${mobile}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="text-lg py-3"
                    maxLength={10}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 10-digit mobile number
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg"
                  disabled={isLoading || !mobile}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
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
                  <p className="text-xs text-muted-foreground text-center">
                    Please check your SMS for the verification code
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full py-3 text-lg"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={handleBackToPhone}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
