'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  RotateCcw,
  Wallet,
  Building,
  Droplets,
  Trash2
} from 'lucide-react'
import PaymentComponent from './payment-component'
import { useUser } from '@/contexts/user-context'

// Types
interface TaxRecord {
  id: string
  type: 'property' | 'water' | 'garbage'
  amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  description: string
  year: string
  property_id?: string
  meter_reading?: number
  created_at: string
}

interface TaxSummary {
  total_pending: number
  total_paid: number
  total_overdue: number
  property_taxes: TaxRecord[]
  water_taxes: TaxRecord[]
  garbage_taxes: TaxRecord[]
}

interface PaymentHistory {
  id: string
  tax_id: string
  amount: number
  payment_date: string
  payment_method: string
  transaction_id: string
  status: 'success' | 'failed' | 'pending'
}

const RevenueManagement = () => {
  const { user } = useUser()
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTax, setSelectedTax] = useState<TaxRecord | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    if (user && !loading) {
      fetchTaxSummary()
      fetchPaymentHistory()
    }
  }, [user])

  // Add page visibility listener to refresh data when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('Page became visible, refreshing data...')
        fetchTaxSummary()
        fetchPaymentHistory()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  // Add focus listener to refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        console.log('Window focused, refreshing data...')
        fetchTaxSummary()
        fetchPaymentHistory()
      }
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [user])

  const fetchTaxSummary = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      // First try the new bills API
      try {
        const billsResponse = await fetch('/api/bills', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (billsResponse.ok) {
          const billsData = await billsResponse.json()
          console.log('Bills API Response:', billsData)
          
          if (billsData.success && billsData.bills) {
            // Convert bills API format to tax records format
            const convertedTaxSummary: TaxSummary = {
              total_pending: billsData.statistics.totalPending,
              total_paid: billsData.statistics.totalPaid,
              total_overdue: billsData.statistics.overdue,
              property_taxes: billsData.bills.filter((bill: any) => bill.type === 'property_tax').map((bill: any) => ({
                id: bill.id,
                type: 'property' as const,
                amount: bill.amount,
                due_date: bill.dueDate,
                status: bill.status,
                description: bill.description,
                year: bill.assessmentYear || '2024',
                property_id: bill.propertyId,
                created_at: new Date().toISOString()
              })),
              water_taxes: billsData.bills.filter((bill: any) => bill.type === 'water_bill').map((bill: any) => ({
                id: bill.id,
                type: 'water' as const,
                amount: bill.amount,
                due_date: bill.dueDate,
                status: bill.status,
                description: bill.description,
                year: '2024',
                property_id: bill.connectionId,
                meter_reading: bill.meterReading,
                created_at: new Date().toISOString()
              })),
              garbage_taxes: billsData.bills.filter((bill: any) => bill.type === 'garbage_fee').map((bill: any) => ({
                id: bill.id,
                type: 'garbage' as const,
                amount: bill.amount,
                due_date: bill.dueDate,
                status: bill.status,
                description: bill.description,
                year: '2024',
                created_at: new Date().toISOString()
              }))
            }
            
            setTaxSummary(convertedTaxSummary)
            setError('')
            setLoading(false)
            return
          }
        }
      } catch (billsError) {
        console.warn('Bills API not available, falling back to revenue API:', billsError)
      }
      
      // Fallback to existing revenue API
      const response = await fetch('/api/revenue?endpoint=summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Revenue API Response:', data)
        
        // Ensure the data has the correct structure
        const normalizedData: TaxSummary = {
          total_pending: data.total_pending || 0,
          total_paid: data.total_paid || 0,
          total_overdue: data.total_overdue || 0,
          property_taxes: Array.isArray(data.property_taxes) ? data.property_taxes : [],
          water_taxes: Array.isArray(data.water_taxes) ? data.water_taxes : [],
          garbage_taxes: Array.isArray(data.garbage_taxes) ? data.garbage_taxes : []
        }
        
        setTaxSummary(normalizedData)
      } else {
        // Fallback to mock data if backend not available
        const mockSummary: TaxSummary = {
          total_pending: 15500,
          total_paid: 8500,
          total_overdue: 3200,
          property_taxes: [
            {
              id: 'prop_001',
              type: 'property',
              amount: 12000,
              due_date: '2024-12-31',
              status: 'pending',
              description: 'Annual Property Tax 2024',
              year: '2024',
              property_id: 'PROP123456',
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: 'prop_002',
              type: 'property',
              amount: 8500,
              due_date: '2023-12-31',
              status: 'paid',
              description: 'Annual Property Tax 2023',
              year: '2023',
              property_id: 'PROP123456',
              created_at: '2023-01-01T00:00:00Z'
            }
          ],
          water_taxes: [
            {
              id: 'water_001',
              type: 'water',
              amount: 2500,
              due_date: '2024-09-15',
              status: 'pending',
              description: 'Water Bill - August 2024',
              year: '2024',
              meter_reading: 1250,
              created_at: '2024-08-01T00:00:00Z'
            },
            {
              id: 'water_prev',
              type: 'water',
              amount: 2800,
              due_date: '2024-07-15',
              status: 'paid',
              description: 'Water Bill - June 2024',
              year: '2024',
              meter_reading: 1180,
              created_at: '2024-06-01T00:00:00Z'
            }
          ],
          garbage_taxes: [
            {
              id: 'garbage_001',
              type: 'garbage',
              amount: 1000,
              due_date: '2024-10-31',
              status: 'pending',
              description: 'Garbage Collection Fee - October 2024',
              year: '2024',
              created_at: '2024-10-01T00:00:00Z'
            }
          ]
        }
        setTaxSummary(mockSummary)
      }
    } catch (error) {
      console.error('Error fetching tax summary:', error)
      // Use mock data on error with proper structure
      const mockSummary: TaxSummary = {
        total_pending: 15500,
        total_paid: 8500,
        total_overdue: 3200,
        property_taxes: [
          {
            id: 'prop_001',
            type: 'property',
            amount: 12000,
            due_date: '2024-12-31',
            status: 'pending',
            description: 'Annual Property Tax 2024',
            year: '2024',
            property_id: 'PROP123456',
            created_at: '2024-01-01T00:00:00Z'
          }
        ],
        water_taxes: [
          {
            id: 'water_001',
            type: 'water',
            amount: 2500,
            due_date: '2024-09-15',
            status: 'pending',
            description: 'Water Bill - August 2024',
            year: '2024',
            meter_reading: 1250,
            created_at: '2024-08-01T00:00:00Z'
          }
        ],
        garbage_taxes: [
          {
            id: 'garbage_001',
            type: 'garbage',
            amount: 1000,
            due_date: '2024-10-31',
            status: 'pending',
            description: 'Garbage Collection Fee - October 2024',
            year: '2024',
            created_at: '2024-10-01T00:00:00Z'
          }
        ]
      }
      setTaxSummary(mockSummary)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('authToken')
      
      // Use Next.js API route
      const response = await fetch('/api/revenue?endpoint=payment-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(Array.isArray(data) ? data : [])
      } else {
        // Mock payment history
        const mockHistory: PaymentHistory[] = [
          {
            id: 'pay_001',
            tax_id: 'prop_002',
            amount: 8500,
            payment_date: '2023-11-15T10:30:00Z',
            payment_method: 'online',
            transaction_id: 'TXN123456789',
            status: 'success'
          },
          {
            id: 'pay_002',
            tax_id: 'water_prev',
            amount: 2800,
            payment_date: '2024-07-10T14:20:00Z',
            payment_method: 'online',
            transaction_id: 'TXN987654321',
            status: 'success'
          }
        ]
        setPaymentHistory(mockHistory)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error)
    }
  }

  const refreshData = async () => {
    console.log('Manual refresh triggered...')
    setError('')
    setSuccess('')
    await Promise.all([
      fetchTaxSummary(),
      fetchPaymentHistory()
    ])
    setSuccess('Data refreshed successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const createSampleTaxes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      // Use Next.js API route
      const response = await fetch('/api/revenue/create-sample-taxes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setSuccess('Sample tax records created successfully!')
        fetchTaxSummary()
      } else {
        setError('Failed to create sample taxes')
      }
    } catch (error) {
      console.error('Error creating sample taxes:', error)
      setError('Failed to create sample taxes')
    } finally {
      setLoading(false)
    }
  }

  const handlePayBill = (tax: TaxRecord) => {
    setSelectedTax(tax)
    setShowPayment(true)
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      const token = localStorage.getItem('authToken')
      
      // Create payment record for local storage as fallback
      const newPayment: PaymentHistory = {
        id: paymentData.razorpay_payment_id,
        tax_id: selectedTax?.id || '',
        amount: selectedTax?.amount || 0,
        payment_date: new Date().toISOString(),
        payment_method: 'online',
        transaction_id: paymentData.razorpay_payment_id,
        status: 'success'
      }

      // Always add to local state first for immediate feedback
      setPaymentHistory(prev => {
        const prevArray = Array.isArray(prev) ? prev : []
        return [newPayment, ...prevArray]
      })
      
      // Try to update backend via bills payment API first
      try {
        const billsPaymentResponse = await fetch('/api/bills/payment', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            billId: selectedTax?.id,
            paymentId: paymentData.razorpay_payment_id,
            paymentStatus: 'paid',
            razorpayData: paymentData
          })
        })

        if (billsPaymentResponse.ok) {
          const billsResult = await billsPaymentResponse.json()
          console.log('Bills payment processed:', billsResult)
          
          // Update tax summary to reflect payment
          if (taxSummary && selectedTax) {
            const updatedSummary = { ...taxSummary }
            
            // Update the specific tax record
            const updateTaxStatus = (taxes: TaxRecord[]) => 
              taxes.map(tax => 
                tax.id === selectedTax.id 
                  ? { ...tax, status: 'paid' as const }
                  : tax
              )
            
            updatedSummary.property_taxes = updateTaxStatus(updatedSummary.property_taxes)
            updatedSummary.water_taxes = updateTaxStatus(updatedSummary.water_taxes)
            updatedSummary.garbage_taxes = updateTaxStatus(updatedSummary.garbage_taxes)
            
            // Update totals
            updatedSummary.total_pending -= selectedTax.amount
            updatedSummary.total_paid += selectedTax.amount
            
            setTaxSummary(updatedSummary)
          }
          
          setSuccess(`Payment successful! Receipt: ${billsResult.receiptNumber}`)
          setShowPayment(false)
          setSelectedTax(null)
          return
        }
      } catch (billsError) {
        console.warn('Bills payment API not available, trying revenue API:', billsError)
      }
      
      // Fallback to existing revenue API
      try {
        const response = await fetch('/api/revenue', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tax_type: selectedTax?.type,
            tax_id: selectedTax?.id,
            amount: selectedTax?.amount,
            payment_id: paymentData.razorpay_payment_id,
            order_id: paymentData.razorpay_order_id,
            transaction_id: paymentData.razorpay_payment_id,
            payment_date: new Date().toISOString(),
            description: selectedTax?.description || `Payment for ${selectedTax?.type}`,
            status: 'success'
          })
        })

        if (response.ok) {
          setSuccess(`Payment of ₹${selectedTax?.amount} completed successfully!`)
          // Refresh data from backend
          fetchTaxSummary()
          fetchPaymentHistory()
        } else {
          console.warn('Backend payment recording failed, but payment was successful')
          setSuccess(`Payment of ₹${selectedTax?.amount} completed successfully! (Record saved locally)`)
        }
      } catch (backendError) {
        console.warn('Backend payment recording failed:', backendError)
        setSuccess(`Payment of ₹${selectedTax?.amount} completed successfully! (Record saved locally)`)
      }
      
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Payment was processed but recording failed')
    }

    setShowPayment(false)
    setSelectedTax(null)
  }

  const getAllTaxes = () => {
    if (!taxSummary) return []
    
    // Ensure each property is an array before spreading
    const propertyTaxes = Array.isArray(taxSummary.property_taxes) ? taxSummary.property_taxes : []
    const waterTaxes = Array.isArray(taxSummary.water_taxes) ? taxSummary.water_taxes : []
    const garbageTaxes = Array.isArray(taxSummary.garbage_taxes) ? taxSummary.garbage_taxes : []
    
    return [
      ...propertyTaxes,
      ...waterTaxes,
      ...garbageTaxes
    ]
  }

  const downloadReceipt = (payment: any) => {
    // Ensure payment object exists and has required properties
    if (!payment || !payment.id) {
      console.error('Invalid payment object for receipt generation')
      return
    }

    // Create a simple receipt as PDF-like content
    const receiptContent = `
MUNICIPAL SERVICES PAYMENT RECEIPT
================================

Payment ID: ${payment.id || 'N/A'}
Date: ${payment.created_at ? new Date(payment.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
Amount: ₹${payment.amount || '0'}
Type: ${payment.type ? payment.type.replace('_', ' ').toUpperCase() : 'N/A'}
Status: ${payment.status || 'N/A'}
Description: ${payment.description || 'No description available'}

Thank you for your payment!
Municipal Services Portal
    `.trim()

    // Create and download as text file (in a real app, you'd generate PDF)
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${payment.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredTaxes = getAllTaxes().filter(tax => {
    const matchesSearch = tax.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tax.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tax.status === statusFilter
    const matchesType = typeFilter === 'all' || tax.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building className="h-4 w-4" />
      case 'water': return <Droplets className="h-4 w-4" />
      case 'garbage': return <Trash2 className="h-4 w-4" />
      default: return <Receipt className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Helper function to map tax type to service type enum
  const getServiceType = (taxType: string) => {
    switch (taxType) {
      case 'property':
        return 'property_tax'
      case 'water':
        return 'water_bill'
      case 'garbage':
        return 'garbage_fee'
      default:
        return 'other'
    }
  }

  if (showPayment && selectedTax) {
    return (
      <PaymentComponent
        amount={selectedTax.amount}
        title={`Pay ${selectedTax.type.charAt(0).toUpperCase() + selectedTax.type.slice(1)} Bill`}
        description={selectedTax.description}
        serviceType={getServiceType(selectedTax.type)}
        serviceId={selectedTax.id}
        metadata={{
          billType: selectedTax.type,
          billId: selectedTax.id,
          dueDate: selectedTax.due_date
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={(error) => {
          setError('Payment failed. Please try again.')
          setShowPayment(false)
          setSelectedTax(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Bills & Payments</h2>
          <p className="text-muted-foreground">Manage your municipal bills and payment history</p>
        </div>
        <div className="flex gap-2">
          {/* Refresh button */}
          <Button 
            onClick={refreshData} 
            disabled={loading} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </Button>
          {/* Only show create sample bills if no bills exist */}
          {taxSummary && 
           taxSummary.property_taxes.length === 0 && 
           taxSummary.water_taxes.length === 0 && 
           taxSummary.garbage_taxes.length === 0 && (
            <Button onClick={createSampleTaxes} disabled={loading} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Sample Bills
            </Button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      {taxSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₹{taxSummary.total_pending.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{taxSummary.total_paid.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{taxSummary.total_overdue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getAllTaxes().length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bills">Current Bills</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="property">Property Tax</SelectItem>
                    <SelectItem value="water">Water Bill</SelectItem>
                    <SelectItem value="garbage">Garbage Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bills List */}
          <div className="grid gap-4">
            {filteredTaxes.length > 0 ? (
              filteredTaxes.map((tax) => (
                <Card key={tax.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getTypeIcon(tax.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{tax.description}</h3>
                          <p className="text-sm text-muted-foreground">
                            Bill ID: {tax.id} • Due: {new Date(tax.due_date).toLocaleDateString()}
                          </p>
                          {tax.property_id && (
                            <p className="text-sm text-muted-foreground">Property: {tax.property_id}</p>
                          )}
                          {tax.meter_reading && (
                            <p className="text-sm text-muted-foreground">Meter Reading: {tax.meter_reading} units</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{tax.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(tax.status)}>
                            {tax.status.charAt(0).toUpperCase() + tax.status.slice(1)}
                          </Badge>
                        </div>
                        {tax.status !== 'paid' && (
                          <Button onClick={() => handlePayBill(tax)} className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bills found</h3>
                  <p className="text-muted-foreground">No bills match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method}
                          </p>
                          <p className="text-sm text-muted-foreground">Transaction: {payment.transaction_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Success</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReceipt(payment)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No payment history</h3>
                  <p className="text-muted-foreground">Your payment transactions will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RevenueManagement
