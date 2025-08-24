'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/user-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Filter, MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, XCircle, FileText, Eye, Download } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import payment component to avoid SSR issues
const CertificateWithPayment = dynamic(() => import('./certificate-with-payment'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">Loading payment component...</div>
})

interface CertificateType {
  type: string
  name: string
  description: string
  requirements: string[]
  processingTime: string
  fee: number
}

interface CertificateApplication {
  id: string
  application_id: string
  certificate_type: string
  status: string
  created_at: string
  updated_at: string
  data: any
  documents: string[]
  admin_notes?: string
}

const statusColors = {
  pending: 'bg-yellow-500',
  under_review: 'bg-blue-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  issued: 'bg-purple-500'
}

const statusIcons = {
  pending: Clock,
  under_review: AlertCircle,
  approved: CheckCircle,
  rejected: AlertCircle,
  issued: FileText
}

export default function CertificateManagement() {
  const { user } = useUser()
  const [applications, setApplications] = useState<CertificateApplication[]>([])
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCertType, setSelectedCertType] = useState('')
  const [requirements, setRequirements] = useState<string[]>([])
  
  // Payment workflow states
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [paymentApplicationData, setPaymentApplicationData] = useState<any>(null)
  const [selectedCertTypeForPayment, setSelectedCertTypeForPayment] = useState<CertificateType | null>(null)

  // Form state for different certificate types
  const [birthFormData, setBirthFormData] = useState({
    child_name: '',
    date_of_birth: '',
    place_of_birth: '',
    father_name: '',
    mother_name: '',
    father_occupation: '',
    mother_occupation: '',
    permanent_address: '',
    hospital_name: '',
    documents: []
  })

  const [deathFormData, setDeathFormData] = useState({
    deceased_name: '',
    date_of_death: '',
    place_of_death: '',
    cause_of_death: '',
    father_husband_name: '',
    permanent_address: '',
    age_at_death: '',
    gender: '',
    hospital_name: '',
    documents: []
  })

  const [marriageFormData, setMarriageFormData] = useState({
    groom_name: '',
    bride_name: '',
    date_of_marriage: '',
    place_of_marriage: '',
    groom_father_name: '',
    bride_father_name: '',
    groom_age: '',
    bride_age: '',
    groom_address: '',
    bride_address: '',
    witness1_name: '',
    witness2_name: '',
    documents: []
  })

  useEffect(() => {
    fetchCertificateTypes()
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchCertificateTypes = async () => {
    try {
      // Mock data since certificates API might not be fully implemented
      const mockTypes: CertificateType[] = [
        {
          type: 'birth',
          name: 'Birth Certificate',
          description: 'Official document certifying the birth of a person',
          requirements: [
            'Hospital birth record',
            'Parents identity proof',
            'Address proof',
            'Application form'
          ],
          processingTime: '7-10 working days',
          fee: 50
        },
        {
          type: 'death',
          name: 'Death Certificate',
          description: 'Official document certifying the death of a person',
          requirements: [
            'Medical certificate of death',
            'Identity proof of deceased',
            'Applicant identity proof',
            'Address proof'
          ],
          processingTime: '5-7 working days',
          fee: 50
        },
        {
          type: 'marriage',
          name: 'Marriage Certificate',
          description: 'Official document certifying the marriage between two individuals',
          requirements: [
            'Marriage registration form',
            'Identity proof of both parties',
            'Age proof of both parties',
            'Address proof',
            'Passport size photographs',
            'Witness identity proofs'
          ],
          processingTime: '10-15 working days',
          fee: 100
        }
      ]
      setCertificateTypes(mockTypes)
    } catch (error) {
      console.error('Error fetching certificate types:', error)
    }
  }

  const fetchApplications = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      // Mock data for now - in real implementation this would call the certificates API
      const mockApplications: CertificateApplication[] = [
        {
          id: '1',
          application_id: 'BIRTH2024001',
          certificate_type: 'birth',
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          data: {
            child_name: 'Aarav Sharma',
            date_of_birth: '2024-01-15',
            father_name: 'Rohit Sharma',
            mother_name: 'Priya Sharma'
          },
          documents: []
        },
        {
          id: '2',
          application_id: 'DEATH2024002',
          certificate_type: 'death',
          status: 'approved',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          data: {
            deceased_name: 'Ramesh Kumar',
            date_of_death: '2024-07-20',
            age_at_death: 75
          },
          documents: []
        }
      ]
      setApplications(mockApplications)
    } catch (error) {
      setError('Error fetching applications')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCertificateTypeSelect = (type: string) => {
    setSelectedCertType(type)
    const certType = certificateTypes.find(ct => ct.type === type)
    if (certType) {
      setRequirements(certType.requirements)
    }
  }

  const submitApplication = async () => {
    if (!user || !selectedCertType) return
    
    try {
      setCreating(true)
      setError('')
      
      let formData
      switch (selectedCertType) {
        case 'birth':
          formData = birthFormData
          break
        case 'death':
          formData = deathFormData
          break
        case 'marriage':
          formData = marriageFormData
          break
        default:
          throw new Error('Invalid certificate type')
      }

      // Find the certificate type for payment flow
      const certType = certificateTypes.find(ct => ct.type === selectedCertType)
      if (!certType) {
        throw new Error('Certificate type not found')
      }

      // Set up payment flow
      setPaymentApplicationData(formData)
      setSelectedCertTypeForPayment(certType)
      setIsCreateDialogOpen(false)
      setShowPaymentFlow(true)
      
    } catch (error) {
      setError('Error preparing application')
      console.error('Error:', error)
    } finally {
      setCreating(false)
    }
  }

  // Handle payment completion
  const handlePaymentComplete = (applicationId: string, paymentData: any) => {
    console.log('Payment completed for application:', applicationId, paymentData)
    
    // Add new application to the list
    const newApplication: CertificateApplication = {
      id: Date.now().toString(),
      application_id: applicationId,
      certificate_type: selectedCertTypeForPayment?.type || '',
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      data: paymentApplicationData,
      documents: []
    }
    
    setApplications(prev => [newApplication, ...prev])
    setSuccess('Certificate application submitted and payment completed successfully!')
    
    // Reset payment flow
    setShowPaymentFlow(false)
    setPaymentApplicationData(null)
    setSelectedCertTypeForPayment(null)
    resetForms()
  }

  // Reset all forms
  const resetForms = () => {
    setBirthFormData({
      child_name: '', date_of_birth: '', place_of_birth: '', father_name: '',
      mother_name: '', father_occupation: '', mother_occupation: '',
      permanent_address: '', hospital_name: '', documents: []
    })
    setDeathFormData({
      deceased_name: '', date_of_death: '', place_of_death: '', cause_of_death: '',
      father_husband_name: '', permanent_address: '', age_at_death: '',
      gender: '', hospital_name: '', documents: []
    })
    setMarriageFormData({
      groom_name: '', bride_name: '', date_of_marriage: '', place_of_marriage: '',
      groom_father_name: '', bride_father_name: '', groom_age: '', bride_age: '',
      groom_address: '', bride_address: '', witness1_name: '', witness2_name: '', documents: []
    })
    setSelectedCertType('')
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificateTypes.find(ct => ct.type === app.certificate_type)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock
    return <Icon className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show payment flow when triggered
  if (showPaymentFlow && selectedCertTypeForPayment && paymentApplicationData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Certificate Payment</h2>
            <p className="text-muted-foreground">Complete payment for your certificate application</p>
          </div>
        </div>
        
        <CertificateWithPayment
          certificateType={selectedCertTypeForPayment}
          applicationData={paymentApplicationData}
          onApplicationComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPaymentFlow(false)
            setPaymentApplicationData(null)
            setSelectedCertTypeForPayment(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Certificate Management</h2>
          <p className="text-muted-foreground">Apply for and track your municipal certificates</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Apply for Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for Certificate</DialogTitle>
              <DialogDescription>
                Select the type of certificate you want to apply for and fill out the required information.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={selectedCertType} onValueChange={handleCertificateTypeSelect}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="birth">Birth Certificate</TabsTrigger>
                <TabsTrigger value="death">Death Certificate</TabsTrigger>
                <TabsTrigger value="marriage">Marriage Certificate</TabsTrigger>
              </TabsList>
              
              {/* Birth Certificate Form */}
              <TabsContent value="birth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="child_name">Child's Name *</Label>
                    <Input
                      id="child_name"
                      value={birthFormData.child_name}
                      onChange={(e) => setBirthFormData({...birthFormData, child_name: e.target.value})}
                      placeholder="Full name of the child"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={birthFormData.date_of_birth}
                      onChange={(e) => setBirthFormData({...birthFormData, date_of_birth: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="place_of_birth">Place of Birth *</Label>
                    <Input
                      id="place_of_birth"
                      value={birthFormData.place_of_birth}
                      onChange={(e) => setBirthFormData({...birthFormData, place_of_birth: e.target.value})}
                      placeholder="Hospital/place where child was born"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hospital_name">Hospital Name</Label>
                    <Input
                      id="hospital_name"
                      value={birthFormData.hospital_name}
                      onChange={(e) => setBirthFormData({...birthFormData, hospital_name: e.target.value})}
                      placeholder="Name of the hospital"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Father's Name *</Label>
                    <Input
                      id="father_name"
                      value={birthFormData.father_name}
                      onChange={(e) => setBirthFormData({...birthFormData, father_name: e.target.value})}
                      placeholder="Full name of father"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mother_name">Mother's Name *</Label>
                    <Input
                      id="mother_name"
                      value={birthFormData.mother_name}
                      onChange={(e) => setBirthFormData({...birthFormData, mother_name: e.target.value})}
                      placeholder="Full name of mother"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="father_occupation">Father's Occupation</Label>
                    <Input
                      id="father_occupation"
                      value={birthFormData.father_occupation}
                      onChange={(e) => setBirthFormData({...birthFormData, father_occupation: e.target.value})}
                      placeholder="Father's occupation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mother_occupation">Mother's Occupation</Label>
                    <Input
                      id="mother_occupation"
                      value={birthFormData.mother_occupation}
                      onChange={(e) => setBirthFormData({...birthFormData, mother_occupation: e.target.value})}
                      placeholder="Mother's occupation"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="permanent_address">Permanent Address *</Label>
                  <Textarea
                    id="permanent_address"
                    value={birthFormData.permanent_address}
                    onChange={(e) => setBirthFormData({...birthFormData, permanent_address: e.target.value})}
                    placeholder="Complete permanent address"
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              {/* Death Certificate Form */}
              <TabsContent value="death" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deceased_name">Deceased's Name *</Label>
                    <Input
                      id="deceased_name"
                      value={deathFormData.deceased_name}
                      onChange={(e) => setDeathFormData({...deathFormData, deceased_name: e.target.value})}
                      placeholder="Full name of deceased"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_of_death">Date of Death *</Label>
                    <Input
                      id="date_of_death"
                      type="date"
                      value={deathFormData.date_of_death}
                      onChange={(e) => setDeathFormData({...deathFormData, date_of_death: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="place_of_death">Place of Death *</Label>
                    <Input
                      id="place_of_death"
                      value={deathFormData.place_of_death}
                      onChange={(e) => setDeathFormData({...deathFormData, place_of_death: e.target.value})}
                      placeholder="Hospital/place where death occurred"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cause_of_death">Cause of Death</Label>
                    <Input
                      id="cause_of_death"
                      value={deathFormData.cause_of_death}
                      onChange={(e) => setDeathFormData({...deathFormData, cause_of_death: e.target.value})}
                      placeholder="Cause of death"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age_at_death">Age at Death *</Label>
                    <Input
                      id="age_at_death"
                      type="number"
                      value={deathFormData.age_at_death}
                      onChange={(e) => setDeathFormData({...deathFormData, age_at_death: e.target.value})}
                      placeholder="Age at time of death"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select 
                      value={deathFormData.gender} 
                      onValueChange={(value) => setDeathFormData({...deathFormData, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="father_husband_name">Father/Husband Name *</Label>
                    <Input
                      id="father_husband_name"
                      value={deathFormData.father_husband_name}
                      onChange={(e) => setDeathFormData({...deathFormData, father_husband_name: e.target.value})}
                      placeholder="Name of father or husband"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="death_hospital_name">Hospital Name</Label>
                    <Input
                      id="death_hospital_name"
                      value={deathFormData.hospital_name}
                      onChange={(e) => setDeathFormData({...deathFormData, hospital_name: e.target.value})}
                      placeholder="Name of the hospital"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="death_permanent_address">Permanent Address *</Label>
                  <Textarea
                    id="death_permanent_address"
                    value={deathFormData.permanent_address}
                    onChange={(e) => setDeathFormData({...deathFormData, permanent_address: e.target.value})}
                    placeholder="Complete permanent address"
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              {/* Marriage Certificate Form */}
              <TabsContent value="marriage" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groom_name">Groom's Name *</Label>
                    <Input
                      id="groom_name"
                      value={marriageFormData.groom_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, groom_name: e.target.value})}
                      placeholder="Full name of groom"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bride_name">Bride's Name *</Label>
                    <Input
                      id="bride_name"
                      value={marriageFormData.bride_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, bride_name: e.target.value})}
                      placeholder="Full name of bride"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date_of_marriage">Date of Marriage *</Label>
                    <Input
                      id="date_of_marriage"
                      type="date"
                      value={marriageFormData.date_of_marriage}
                      onChange={(e) => setMarriageFormData({...marriageFormData, date_of_marriage: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="place_of_marriage">Place of Marriage *</Label>
                    <Input
                      id="place_of_marriage"
                      value={marriageFormData.place_of_marriage}
                      onChange={(e) => setMarriageFormData({...marriageFormData, place_of_marriage: e.target.value})}
                      placeholder="Venue of marriage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groom_age">Groom's Age *</Label>
                    <Input
                      id="groom_age"
                      type="number"
                      value={marriageFormData.groom_age}
                      onChange={(e) => setMarriageFormData({...marriageFormData, groom_age: e.target.value})}
                      placeholder="Age of groom"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bride_age">Bride's Age *</Label>
                    <Input
                      id="bride_age"
                      type="number"
                      value={marriageFormData.bride_age}
                      onChange={(e) => setMarriageFormData({...marriageFormData, bride_age: e.target.value})}
                      placeholder="Age of bride"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groom_father_name">Groom's Father Name *</Label>
                    <Input
                      id="groom_father_name"
                      value={marriageFormData.groom_father_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, groom_father_name: e.target.value})}
                      placeholder="Name of groom's father"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bride_father_name">Bride's Father Name *</Label>
                    <Input
                      id="bride_father_name"
                      value={marriageFormData.bride_father_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, bride_father_name: e.target.value})}
                      placeholder="Name of bride's father"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="witness1_name">Witness 1 Name *</Label>
                    <Input
                      id="witness1_name"
                      value={marriageFormData.witness1_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, witness1_name: e.target.value})}
                      placeholder="Name of first witness"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="witness2_name">Witness 2 Name *</Label>
                    <Input
                      id="witness2_name"
                      value={marriageFormData.witness2_name}
                      onChange={(e) => setMarriageFormData({...marriageFormData, witness2_name: e.target.value})}
                      placeholder="Name of second witness"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groom_address">Groom's Address *</Label>
                    <Textarea
                      id="groom_address"
                      value={marriageFormData.groom_address}
                      onChange={(e) => setMarriageFormData({...marriageFormData, groom_address: e.target.value})}
                      placeholder="Complete address of groom"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bride_address">Bride's Address *</Label>
                    <Textarea
                      id="bride_address"
                      value={marriageFormData.bride_address}
                      onChange={(e) => setMarriageFormData({...marriageFormData, bride_address: e.target.value})}
                      placeholder="Complete address of bride"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Requirements Display */}
            {selectedCertType && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {requirements.map((req, index) => (
                      <li key={index} className="text-sm">{req}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Processing Time:</strong> {certificateTypes.find(ct => ct.type === selectedCertType)?.processingTime}</p>
                    <p><strong>Fee:</strong> ₹{certificateTypes.find(ct => ct.type === selectedCertType)?.fee}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitApplication} 
                disabled={creating || !selectedCertType}
              >
                {creating ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Certificate Types Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificateTypes.map((certType) => (
          <Card key={certType.type} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {certType.name}
              </CardTitle>
              <CardDescription>{certType.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Processing Time:</strong> {certType.processingTime}</p>
                <p><strong>Fee:</strong> ₹{certType.fee}</p>
                <div>
                  <strong>Requirements:</strong>
                  <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                    {certType.requirements.slice(0, 3).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                    {certType.requirements.length > 3 && (
                      <li>+ {certType.requirements.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            My Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Search Applications</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by application ID or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground mb-4">
                  {applications.length === 0 
                    ? "You haven't submitted any certificate applications yet."
                    : "No applications match your current filters."
                  }
                </p>
                {applications.length === 0 && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Apply for Your First Certificate
                  </Button>
                )}
              </div>
            ) : (
              filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {certificateTypes.find(ct => ct.type === app.certificate_type)?.name || app.certificate_type}
                          <Badge variant="outline" className="text-xs">
                            #{app.application_id}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Applied on {new Date(app.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={`${statusColors[app.status as keyof typeof statusColors]} text-white flex items-center gap-1`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Updated: {new Date(app.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {app.status === 'issued' && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                    {app.admin_notes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Admin Notes:</strong> {app.admin_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
