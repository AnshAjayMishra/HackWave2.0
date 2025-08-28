import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertCircle, FileText, MapPin, Phone, User } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface GrievanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface GrievanceFormData {
  title: string
  description: string
  category: string
  priority: string
  location: string
  address: string
  landmark: string
  ward_number: string
  pin_code: string
  contact_person: string
  alternate_mobile: string
  anonymous: boolean
}

const GRIEVANCE_CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Roads and Transportation',
  'Waste Management',
  'Drainage and Sewerage',
  'Public Health',
  'Building and Construction',
  'Education',
  'Public Safety',
  'Revenue and Taxation',
  'Other'
]

const PRIORITIES = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

export default function GrievanceForm({ isOpen, onClose, onSuccess }: GrievanceFormProps) {
  const [formData, setFormData] = useState<GrievanceFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    address: '',
    landmark: '',
    ward_number: '',
    pin_code: '',
    contact_person: '',
    alternate_mobile: '',
    anonymous: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof GrievanceFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`Failed to submit grievance: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 2000)
      } else {
        throw new Error(result.error || 'Failed to submit grievance')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit grievance')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <FileText className="mr-2 h-5 w-5" />
            Submit New Grievance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Grievance submitted successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Basic Information
              </h3>
              
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  placeholder="Brief title for your grievance"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRIEVANCE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: string) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Location Details
              </h3>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                  placeholder="General location or area"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('address', e.target.value)}
                  placeholder="Complete address with details"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('landmark', e.target.value)}
                    placeholder="Nearby landmark"
                  />
                </div>

                <div>
                  <Label htmlFor="ward_number">Ward Number</Label>
                  <Input
                    id="ward_number"
                    value={formData.ward_number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('ward_number', e.target.value)}
                    placeholder="Ward number"
                  />
                </div>

                <div>
                  <Label htmlFor="pin_code">PIN Code</Label>
                  <Input
                    id="pin_code"
                    value={formData.pin_code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('pin_code', e.target.value)}
                    placeholder="PIN code"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contact_person', e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <Label htmlFor="alternate_mobile">Alternate Mobile</Label>
                  <Input
                    id="alternate_mobile"
                    value={formData.alternate_mobile}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('alternate_mobile', e.target.value)}
                    placeholder="Alternate contact number"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('anonymous', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-label="Submit anonymously"
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Submit anonymously (your identity will not be revealed)
                </Label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.location || !formData.address}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Grievance'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
