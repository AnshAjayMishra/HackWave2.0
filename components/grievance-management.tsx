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
import { Plus, Search, Filter, MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { config } from '@/lib/config'

// Types
interface GrievanceCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface Grievance {
  id: string
  title: string
  description: string
  category: string
  categoryName: string
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  attachments: string[]
  submittedBy: {
    id: string
    name: string
    mobile: string
  }
  assignedTo?: {
    id: string
    name: string
    department: string
  }
  createdAt: string
  updatedAt: string
  expectedResolutionDate?: string
}

interface CreateGrievanceData {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  attachments?: File[]
}

const GrievanceManagement = () => {
  const { user, getAuthToken } = useUser()
  const [categories, setCategories] = useState<GrievanceCategory[]>([])
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Create form state
  const [createForm, setCreateForm] = useState<CreateGrievanceData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: {
      address: '',
      coordinates: { lat: 23.2599, lng: 77.4126 } // Default to Bhopal
    }
  })

  // Helper functions for category mapping
  const getCategoryIcon = (categoryValue: string): string => {
    const iconMap: { [key: string]: string } = {
      'garbage': '🗑️',
      'water_supply': '💧',
      'drainage': '🚰',
      'street_lights': '💡',
      'roads': '🛣️',
      'sewage': '🚿',
      'noise_pollution': '🔊',
      'illegal_construction': '🏗️',
      'property_tax': '🏠',
      'other': '📝'
    }
    return iconMap[categoryValue] || '📝'
  }

  const getCategoryColor = (categoryValue: string): string => {
    const colorMap: { [key: string]: string } = {
      'garbage': 'green',
      'water_supply': 'blue',
      'drainage': 'cyan',
      'street_lights': 'yellow',
      'roads': 'orange',
      'sewage': 'purple',
      'noise_pollution': 'red',
      'illegal_construction': 'gray',
      'property_tax': 'brown',
      'other': 'slate'
    }
    return colorMap[categoryValue] || 'gray'
  }

  // Mock data for development
  const mockCategories: GrievanceCategory[] = [
    { id: '1', name: 'Water Supply', description: 'Water related issues', icon: '💧', color: 'blue' },
    { id: '2', name: 'Road Maintenance', description: 'Road and infrastructure issues', icon: '🛣️', color: 'orange' },
    { id: '3', name: 'Electricity', description: 'Power supply issues', icon: '⚡', color: 'yellow' },
    { id: '4', name: 'Waste Management', description: 'Garbage and sanitation', icon: '🗑️', color: 'green' },
    { id: '5', name: 'Street Lighting', description: 'Street light issues', icon: '💡', color: 'purple' },
    { id: '6', name: 'Public Transport', description: 'Bus and transport issues', icon: '🚌', color: 'red' }
  ]

  const mockGrievances: Grievance[] = [
    {
      id: '1',
      title: 'Water Supply Disruption in Sector 15',
      description: 'There has been no water supply for the past 3 days in our locality.',
      category: '1',
      categoryName: 'Water Supply',
      status: 'in-progress',
      priority: 'high',
      location: {
        address: 'Sector 15, Bhopal',
        coordinates: { lat: 23.2550, lng: 77.4200 }
      },
      attachments: [],
      submittedBy: {
        id: user?.mobile || '',
        name: user?.name || 'Current User',
        mobile: user?.mobile || ''
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      expectedResolutionDate: '2024-01-20T18:00:00Z'
    },
    {
      id: '2',
      title: 'Pothole on Main Road',
      description: 'Large pothole causing traffic issues and accidents.',
      category: '2',
      categoryName: 'Road Maintenance',
      status: 'pending',
      priority: 'medium',
      location: {
        address: 'MP Nagar Main Road, Bhopal',
        coordinates: { lat: 23.2400, lng: 77.4100 }
      },
      attachments: [],
      submittedBy: {
        id: user?.mobile || '',
        name: user?.name || 'Current User',
        mobile: user?.mobile || ''
      },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-14T09:15:00Z'
    }
  ]

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setCategories(mockCategories)
        return
      }

      const response = await fetch(`${config.api.backendUrl}/grievances/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform backend categories to frontend format
        const transformedCategories = data.categories ? data.categories.map((cat: any) => ({
          id: cat.value,
          name: cat.label,
          description: `${cat.label} related issues`,
          icon: getCategoryIcon(cat.value),
          color: getCategoryColor(cat.value)
        })) : mockCategories
        
        setCategories(transformedCategories)
      } else {
        console.warn('Failed to fetch categories, using mock data')
        setCategories(mockCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories(mockCategories)
    }
  }

  // Fetch user's grievances
  const fetchGrievances = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setGrievances(mockGrievances)
        setFilteredGrievances(mockGrievances)
        return
      }

      const response = await fetch(`${config.api.backendUrl}/grievances/my-grievances`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGrievances(data.grievances || mockGrievances)
        setFilteredGrievances(data.grievances || mockGrievances)
      } else {
        console.warn('Failed to fetch grievances, using mock data')
        setGrievances(mockGrievances)
        setFilteredGrievances(mockGrievances)
      }
    } catch (error) {
      console.error('Error fetching grievances:', error)
      setGrievances(mockGrievances)
      setFilteredGrievances(mockGrievances)
    }
  }

  // Create new grievance
  const createGrievance = async () => {
    try {
      setCreateLoading(true)
      const token = getAuthToken()
      
      if (!token) {
        // Mock creation
        const newGrievance: Grievance = {
          id: Date.now().toString(),
          ...createForm,
          categoryName: categories.find(c => c.id === createForm.category)?.name || '',
          status: 'pending',
          attachments: [],
          submittedBy: {
            id: user?.mobile || '',
            name: user?.name || 'Current User',
            mobile: user?.mobile || ''
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setGrievances(prev => [newGrievance, ...prev])
        setFilteredGrievances(prev => [newGrievance, ...prev])
        setIsCreateDialogOpen(false)
        resetCreateForm()
        return
      }

      // Transform frontend data structure to match backend expectations
      const backendPayload = {
        title: createForm.title,
        description: createForm.description,
        category: createForm.category,
        priority: createForm.priority,
        location: createForm.location.address, // Flatten the location object to string
        address: createForm.location.address,  // Also include as address field
        // Add other fields that backend might expect
        ward_number: null,
        pin_code: null,
        contact_person: user?.name || null,
        alternate_mobile: null,
        anonymous: false
      }

      console.log('Sending grievance payload:', backendPayload)

      const response = await fetch(`${config.api.backendUrl}/grievances/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload)
      })

      console.log('Grievance creation response:', response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log('Grievance created successfully:', result)
        await fetchGrievances() // Refresh the list
        setIsCreateDialogOpen(false)
        resetCreateForm()
      } else {
        const errorData = await response.text()
        console.error('Failed to create grievance:', response.status, errorData)
        // Show user-friendly error message
        alert(`Failed to create grievance: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error creating grievance:', error)
      alert('Network error while creating grievance. Please try again.')
    } finally {
      setCreateLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateForm({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      location: {
        address: '',
        coordinates: { lat: 23.2599, lng: 77.4126 }
      }
    })
  }

  // Filter grievances
  useEffect(() => {
    let filtered = grievances

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(g => g.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(g => g.status === selectedStatus)
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(g => g.priority === selectedPriority)
    }

    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredGrievances(filtered)
  }, [grievances, selectedCategory, selectedStatus, selectedPriority, searchTerm])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchGrievances()])
      setLoading(false)
    }
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'in-progress': return 'bg-blue-500'
      case 'resolved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in-progress': return <AlertCircle className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Grievance Management</h2>
          <p className="text-muted-foreground">Submit and track your municipal grievances</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Submit Grievance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Grievance</DialogTitle>
              <DialogDescription>
                Provide details about your municipal service issue
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={createForm.category} onValueChange={(value) => setCreateForm({...createForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={createForm.priority} onValueChange={(value: any) => setCreateForm({...createForm, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="priority-low" value="low">Low</SelectItem>
                    <SelectItem key="priority-medium" value="medium">Medium</SelectItem>
                    <SelectItem key="priority-high" value="high">High</SelectItem>
                    <SelectItem key="priority-urgent" value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Location *</Label>
                <Input
                  id="address"
                  placeholder="Complete address where the issue is located"
                  value={createForm.location.address}
                  onChange={(e) => setCreateForm({
                    ...createForm,
                    location: {...createForm.location, address: e.target.value}
                  })}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createGrievance}
                disabled={createLoading || !createForm.title || !createForm.description || !createForm.category || !createForm.location.address}
              >
                {createLoading ? 'Submitting...' : 'Submit Grievance'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search grievances..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-categories" value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={`category-${category.id}`} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-status" value="all">All Status</SelectItem>
                  <SelectItem key="pending" value="pending">Pending</SelectItem>
                  <SelectItem key="in-progress" value="in-progress">In Progress</SelectItem>
                  <SelectItem key="resolved" value="resolved">Resolved</SelectItem>
                  <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-priorities" value="all">All Priorities</SelectItem>
                  <SelectItem key="low" value="low">Low</SelectItem>
                  <SelectItem key="medium" value="medium">Medium</SelectItem>
                  <SelectItem key="high" value="high">High</SelectItem>
                  <SelectItem key="urgent" value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grievances List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Your Grievances ({filteredGrievances.length})
          </h3>
        </div>

        {filteredGrievances.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No grievances found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'You haven\'t submitted any grievances yet'}
              </p>
              {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && selectedPriority === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Submit Your First Grievance
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredGrievances.map((grievance) => (
              <Card key={grievance.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{grievance.title}</h4>
                        <Badge className={getPriorityColor(grievance.priority)}>
                          {grievance.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{grievance.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(grievance.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {grievance.location.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {grievance.categoryName}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={`${getStatusColor(grievance.status)} text-white`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(grievance.status)}
                          {grievance.status.replace('-', ' ')}
                        </span>
                      </Badge>
                      {grievance.expectedResolutionDate && (
                        <span className="text-xs text-muted-foreground">
                          Expected: {new Date(grievance.expectedResolutionDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {grievance.assignedTo && (
                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        Assigned to {grievance.assignedTo.name} from {grievance.assignedTo.department}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GrievanceManagement
