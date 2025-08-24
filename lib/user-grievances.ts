import { useState, useEffect } from 'react'

// Types
export interface Grievance {
  _id: string
  grievance_id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  location: string
  address: string
  landmark?: string
  ward_number?: string
  pin_code?: string
  contact_person: string
  alternate_mobile?: string
  user_id: string
  user_mobile: string
  anonymous: boolean
  attachments: any[]
  admin_notes?: string
  assigned_to?: string
  estimated_resolution_date?: string
  actual_resolution_date?: string
  created_at: string
  updated_at: string
  status_history: any[]
}

export interface UserGrievancesResponse {
  success: boolean
  grievances: Grievance[]
  total_count: number
  page: number
  per_page: number
}

export interface GrievanceStats {
  total: number
  pending: number
  in_progress: number
  resolved: number
  rejected: number
}

// Hooks
export function useUserGrievances(options: { 
  status?: string
  category?: string
  limit?: number
  skip?: number
} = {}) {
  const [data, setData] = useState<UserGrievancesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    const fetchUserGrievances = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const queryParams = new URLSearchParams()
        if (options.status) queryParams.append('status', options.status)
        if (options.category) queryParams.append('category', options.category)
        if (options.limit) queryParams.append('limit', options.limit.toString())
        if (options.skip) queryParams.append('skip', options.skip.toString())

        const response = await fetch(`/api/grievances?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch grievances: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch grievances')
        console.error('Error fetching user grievances:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserGrievances()
  }, [options.status, options.category, options.limit, options.skip, refreshTrigger])

  return { data, loading, error, refetch }
}

export function useGrievanceCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/grievances/categories')

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }

        const result = await response.json()
        if (result.success) {
          setCategories(result.categories || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useGrievanceStats(grievances: Grievance[]): GrievanceStats {
  return {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'submitted').length,
    in_progress: grievances.filter(g => g.status === 'in_progress').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
    rejected: grievances.filter(g => g.status === 'rejected').length,
  }
}

// Status and priority color helpers
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
      return '📝'
    case 'in_progress':
      return '⏳'
    case 'resolved':
      return '✅'
    case 'rejected':
      return '❌'
    default:
      return '📄'
  }
}
