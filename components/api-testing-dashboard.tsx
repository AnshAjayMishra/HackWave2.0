'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/user-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Database,
  User,
  FileText,
  CreditCard,
  MapPin,
  Settings
} from 'lucide-react'

interface APITestResult {
  name: string
  endpoint: string
  method: string
  status: 'success' | 'error' | 'pending' | 'not-tested'
  statusCode?: number
  responseTime?: number
  data?: any
  error?: string
  timestamp?: string
}

interface APICategory {
  name: string
  icon: React.ReactNode
  color: string
  tests: APITestResult[]
}

const APITestingDashboard = () => {
  const { user, getAuthToken } = useUser()
  const [testing, setTesting] = useState(false)
  const [categories, setCategories] = useState<APICategory[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0
  })

  // Initialize API test categories
  const initializeCategories = (): APICategory[] => {
    return [
      {
        name: 'Authentication',
        icon: <User className="h-4 w-4" />,
        color: 'blue',
        tests: [
          {
            name: 'Get Current User',
            endpoint: '/api/users/me',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Send OTP',
            endpoint: '/api/auth/send-otp',
            method: 'POST',
            status: 'not-tested'
          },
          {
            name: 'Verify OTP',
            endpoint: '/api/auth/verify-otp',
            method: 'POST',
            status: 'not-tested'
          }
        ]
      },
      {
        name: 'Grievances',
        icon: <FileText className="h-4 w-4" />,
        color: 'orange',
        tests: [
          {
            name: 'Get Categories',
            endpoint: '/api/grievances/categories',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Get My Grievances',
            endpoint: '/api/grievances/my-grievances',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Create Grievance',
            endpoint: '/api/grievances/create',
            method: 'POST',
            status: 'not-tested'
          },
          {
            name: 'Admin - Get All Grievances',
            endpoint: '/api/grievances/admin/all',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Admin - Get Stats',
            endpoint: '/api/grievances/admin/stats',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Map Data',
            endpoint: '/api/grievances/admin/map-data',
            method: 'GET',
            status: 'not-tested'
          }
        ]
      },
      {
        name: 'Revenue & Payments',
        icon: <CreditCard className="h-4 w-4" />,
        color: 'green',
        tests: [
          {
            name: 'Revenue Summary',
            endpoint: '/api/revenue/summary',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Property Taxes',
            endpoint: '/api/revenue/property-taxes',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Water Taxes',
            endpoint: '/api/revenue/water-taxes',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Garbage Taxes',
            endpoint: '/api/revenue/garbage-taxes',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Payment History',
            endpoint: '/api/revenue/payment-history',
            method: 'GET',
            status: 'not-tested'
          },
          {
            name: 'Create Sample Taxes',
            endpoint: '/api/revenue/create-sample-taxes',
            method: 'POST',
            status: 'not-tested'
          },
          {
            name: 'Create Razorpay Order',
            endpoint: '/api/payments/create-order',
            method: 'POST',
            status: 'not-tested'
          }
        ]
      },
      {
        name: 'Certificates',
        icon: <Database className="h-4 w-4" />,
        color: 'purple',
        tests: [
          {
            name: 'Apply for Certificate',
            endpoint: '/api/certificates/apply',
            method: 'POST',
            status: 'not-tested'
          },
          {
            name: 'Get Certificate Status',
            endpoint: '/api/certificates/status',
            method: 'GET',
            status: 'not-tested'
          }
        ]
      }
    ]
  }

  // Test individual API endpoint
  const testAPI = async (test: APITestResult, categoryIndex: number, testIndex: number): Promise<void> => {
    const startTime = Date.now()
    
    // Update status to pending
    setCategories(prev => {
      const updated = [...prev]
      updated[categoryIndex].tests[testIndex] = {
        ...test,
        status: 'pending',
        timestamp: new Date().toISOString()
      }
      return updated
    })

    try {
      const token = getAuthToken()
      const headers: any = {
        'Content-Type': 'application/json'
      }
      
      if (token && !test.endpoint.includes('send-otp') && !test.endpoint.includes('verify-otp')) {
        headers['Authorization'] = `Bearer ${token}`
      }

      let body = undefined
      
      // Prepare request body for POST requests
      if (test.method === 'POST') {
        if (test.endpoint.includes('create-grievance')) {
          body = JSON.stringify({
            title: 'Test Grievance from API Testing',
            description: 'This is a test grievance created during API testing',
            category: 'other',
            priority: 'low',
            location: 'Test Location, Bhopal',
            address: 'Test Address',
            ward_number: '1'
          })
        } else if (test.endpoint.includes('send-otp')) {
          body = JSON.stringify({
            mobile: user?.mobile || '+919876543210'
          })
        } else if (test.endpoint.includes('verify-otp')) {
          body = JSON.stringify({
            mobile: user?.mobile || '+919876543210',
            otp: '123456'
          })
        } else if (test.endpoint.includes('create-order')) {
          body = JSON.stringify({
            amount: 100,
            currency: 'INR',
            receipt: `test_${Date.now()}`
          })
        } else if (test.endpoint.includes('certificate')) {
          body = JSON.stringify({
            type: 'birth_certificate',
            applicant_name: 'Test User',
            purpose: 'API Testing'
          })
        }
      }

      const response = await fetch(`http://127.0.0.1:3000${test.endpoint}`, {
        method: test.method,
        headers,
        body
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      // Update with success result
      setCategories(prev => {
        const updated = [...prev]
        updated[categoryIndex].tests[testIndex] = {
          ...test,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          responseTime,
          data: data,
          error: response.ok ? undefined : data.message || data.error || 'Unknown error',
          timestamp: new Date().toISOString()
        }
        return updated
      })

    } catch (error) {
      const responseTime = Date.now() - startTime
      
      // Update with error result
      setCategories(prev => {
        const updated = [...prev]
        updated[categoryIndex].tests[testIndex] = {
          ...test,
          status: 'error',
          responseTime,
          error: error instanceof Error ? error.message : 'Network error',
          timestamp: new Date().toISOString()
        }
        return updated
      })
    }
  }

  // Test all APIs
  const testAllAPIs = async () => {
    setTesting(true)
    
    for (let catIndex = 0; catIndex < categories.length; catIndex++) {
      const category = categories[catIndex]
      for (let testIndex = 0; testIndex < category.tests.length; testIndex++) {
        await testAPI(category.tests[testIndex], catIndex, testIndex)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    setTesting(false)
  }

  // Calculate summary statistics
  const calculateSummary = () => {
    let total = 0
    let success = 0
    let failed = 0
    let pending = 0

    categories.forEach(category => {
      category.tests.forEach(test => {
        total++
        switch (test.status) {
          case 'success':
            success++
            break
          case 'error':
            failed++
            break
          case 'pending':
            pending++
            break
        }
      })
    })

    setSummary({ total, success, failed, pending })
  }

  // Status icon component
  const StatusIcon = ({ status }: { status: APITestResult['status'] }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  // Initialize categories on mount
  useEffect(() => {
    setCategories(initializeCategories())
  }, [])

  // Recalculate summary when categories change
  useEffect(() => {
    calculateSummary()
  }, [categories])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">API Testing Dashboard</h2>
          <p className="text-muted-foreground">Test all backend API endpoints and view their responses</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={testAllAPIs} 
            disabled={testing}
            className="flex items-center gap-2"
          >
            {testing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {testing ? 'Testing...' : 'Test All APIs'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.success}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* API Tests by Category */}
      <Tabs defaultValue="0" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category, index) => (
            <TabsTrigger key={index} value={index.toString()} className="flex items-center gap-2">
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category, categoryIndex) => (
          <TabsContent key={categoryIndex} value={categoryIndex.toString()}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name} APIs
                </CardTitle>
                <CardDescription>
                  {category.tests.length} endpoints in this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.tests.map((test, testIndex) => (
                    <div key={testIndex} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <StatusIcon status={test.status} />
                            <h4 className="font-medium">{test.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {test.method}
                            </Badge>
                            {test.statusCode && (
                              <Badge 
                                variant={test.statusCode >= 200 && test.statusCode < 300 ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {test.statusCode}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {test.endpoint}
                          </p>
                          {test.responseTime && (
                            <p className="text-xs text-muted-foreground">
                              Response time: {test.responseTime}ms
                            </p>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testAPI(test, categoryIndex, testIndex)}
                          disabled={testing || test.status === 'pending'}
                        >
                          {test.status === 'pending' ? 'Testing...' : 'Test'}
                        </Button>
                      </div>

                      {test.error && (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Error:</strong> {test.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {test.data && (
                        <div className="mt-3">
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                              View Response Data
                            </summary>
                            <ScrollArea className="h-32 w-full border rounded mt-2">
                              <pre className="p-3 text-xs font-mono">
                                {JSON.stringify(test.data, null, 2)}
                              </pre>
                            </ScrollArea>
                          </details>
                        </div>
                      )}

                      {test.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          Last tested: {new Date(test.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {user?.name || 'Not logged in'}</p>
            <p><strong>Mobile:</strong> {user?.mobile || 'Not available'}</p>
            <p><strong>Auth Token:</strong> {getAuthToken() ? 'Available' : 'Not available'}</p>
            <p><strong>Backend URL:</strong> http://127.0.0.1:3000</p>
            <p><strong>Frontend URL:</strong> http://localhost:3001</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default APITestingDashboard
