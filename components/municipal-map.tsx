'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { useUser } from '@/contexts/user-context'

// Dynamically import Chart.js components to avoid SSR issues
const Chart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Chart), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-8 w-8 rounded"></div>
})

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 w-full rounded"></div>
})

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 w-64 rounded-full mx-auto"></div>
})

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 w-full rounded"></div>
})

// Dynamically import interactive map
const InteractiveMap = dynamic(() => import('./interactive-map'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Types
interface GrievanceData {
  id: string
  title: string
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
    ward?: number
  }
  createdAt: string
  resolvedAt?: string
}

interface MunicipalStats {
  totalGrievances: number
  pendingGrievances: number
  resolvedGrievances: number
  averageResolutionTime: number
  wardWiseData: { ward: number; count: number }[]
  categoryWiseData: { category: string; count: number }[]
  statusDistribution: { status: string; count: number }[]
  monthlyTrends: { month: string; submitted: number; resolved: number }[]
}

const MunicipalMap = () => {
  const { getAuthToken } = useUser()
  const [grievances, setGrievances] = useState<GrievanceData[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState<MunicipalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30')

  // Mock data for development
  const mockGrievances: GrievanceData[] = [
    {
      id: '1',
      title: 'Water Supply Issue',
      category: '1',
      categoryName: 'Water Supply',
      status: 'pending',
      priority: 'high',
      location: {
        address: 'Sector 15, Bhopal',
        coordinates: { lat: 23.2550, lng: 77.4200 },
        ward: 15
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Road Pothole',
      category: '2',
      categoryName: 'Road Maintenance',
      status: 'resolved',
      priority: 'medium',
      location: {
        address: 'MP Nagar, Bhopal',
        coordinates: { lat: 23.2400, lng: 77.4100 },
        ward: 12
      },
      createdAt: '2024-01-10T09:15:00Z',
      resolvedAt: '2024-01-14T16:30:00Z'
    },
    {
      id: '3',
      title: 'Street Light Not Working',
      category: '5',
      categoryName: 'Street Lighting',
      status: 'in-progress',
      priority: 'low',
      location: {
        address: 'Arera Colony, Bhopal',
        coordinates: { lat: 23.2300, lng: 77.4300 },
        ward: 8
      },
      createdAt: '2024-01-12T14:20:00Z'
    }
  ]

  const mockCategories = [
    { id: '1', name: 'Water Supply', color: '#3b82f6' },
    { id: '2', name: 'Road Maintenance', color: '#ef4444' },
    { id: '3', name: 'Electricity', color: '#f59e0b' },
    { id: '4', name: 'Waste Management', color: '#10b981' },
    { id: '5', name: 'Street Lighting', color: '#8b5cf6' }
  ]

  // Fetch data
  const fetchData = async () => {
    try {
      const token = getAuthToken()
      
      // Fetch both categories and map data
      const requests = []
      
      // Add categories request
      if (token) {
        requests.push(
          fetch(`${config.api.backendUrl}/grievances/categories`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        )
      }
      
      // Add map data request
      requests.push(
        fetch('/api/grievances/map-data', {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          } : {
            'Content-Type': 'application/json',
          },
        })
      )

      const responses = await Promise.all(requests)
      
      // Handle categories response
      if (token && responses[0]?.ok) {
        const categoriesData = await responses[0].json()
        setCategories(categoriesData.categories || mockCategories)
      } else {
        setCategories(mockCategories)
      }

      // Handle map data response
      const mapDataResponse = token ? responses[1] : responses[0]
      if (mapDataResponse?.ok) {
        const mapData = await mapDataResponse.json()
        if (mapData.success && mapData.grievances) {
          // Transform backend data to frontend format
          const transformedGrievances = mapData.grievances.map((g: any) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            categoryName: mockCategories.find(cat => cat.id === g.category)?.name || g.category.replace('_', ' '),
            status: g.status.replace('_', '-') as 'pending' | 'in-progress' | 'resolved' | 'rejected',
            priority: g.priority as 'low' | 'medium' | 'high' | 'urgent',
            location: {
              address: g.location || g.address || 'No address provided',
              coordinates: {
                lat: g.coordinates ? g.coordinates[0] : 23.2599,
                lng: g.coordinates ? g.coordinates[1] : 77.4126
              },
              ward: g.ward_number ? parseInt(g.ward_number) : undefined
            },
            createdAt: g.created_at,
            resolvedAt: g.status === 'resolved' ? g.created_at : undefined
          }))
          
          setGrievances(transformedGrievances)
          calculateStats(transformedGrievances)
        } else {
          // Fallback to mock data
          setGrievances(mockGrievances)
          calculateStats(mockGrievances)
        }
      } else {
        // Fallback to mock data
        setGrievances(mockGrievances)
        calculateStats(mockGrievances)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setGrievances(mockGrievances)
      setCategories(mockCategories)
      calculateStats(mockGrievances)
    }
  }

  // Calculate statistics
  const calculateStats = (grievanceData: GrievanceData[]) => {
    const totalGrievances = grievanceData.length
    const pendingGrievances = grievanceData.filter(g => g.status === 'pending').length
    const resolvedGrievances = grievanceData.filter(g => g.status === 'resolved').length
    
    // Calculate average resolution time
    const resolvedWithTime = grievanceData.filter(g => g.status === 'resolved' && g.resolvedAt)
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((acc, g) => {
          const created = new Date(g.createdAt)
          const resolved = new Date(g.resolvedAt!)
          return acc + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / resolvedWithTime.length
      : 0

    // Ward-wise data
    const wardMap = new Map<number, number>()
    grievanceData.forEach(g => {
      if (g.location.ward) {
        wardMap.set(g.location.ward, (wardMap.get(g.location.ward) || 0) + 1)
      }
    })
    const wardWiseData = Array.from(wardMap.entries()).map(([ward, count]) => ({ ward, count }))

    // Category-wise data
    const categoryMap = new Map<string, number>()
    grievanceData.forEach(g => {
      categoryMap.set(g.categoryName, (categoryMap.get(g.categoryName) || 0) + 1)
    })
    const categoryWiseData = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))

    // Status distribution
    const statusMap = new Map<string, number>()
    grievanceData.forEach(g => {
      statusMap.set(g.status, (statusMap.get(g.status) || 0) + 1)
    })
    const statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))

    // Monthly trends (mock data for now)
    const monthlyTrends = [
      { month: 'Oct', submitted: 45, resolved: 38 },
      { month: 'Nov', submitted: 52, resolved: 41 },
      { month: 'Dec', submitted: 38, resolved: 44 },
      { month: 'Jan', submitted: totalGrievances, resolved: resolvedGrievances }
    ]

    setStats({
      totalGrievances,
      pendingGrievances,
      resolvedGrievances,
      averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      wardWiseData,
      categoryWiseData,
      statusDistribution,
      monthlyTrends
    })
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchData()
      setLoading(false)
    }
    loadData()
  }, [])

  // Chart configurations
  const categoryChartData = {
    labels: stats?.categoryWiseData.map(item => item.category) || [],
    datasets: [
      {
        data: stats?.categoryWiseData.map(item => item.count) || [],
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#8b5cf6',
          '#06b6d4'
        ],
        borderColor: [
          '#1d4ed8',
          '#dc2626',
          '#d97706',
          '#059669',
          '#7c3aed',
          '#0891b2'
        ],
        borderWidth: 2
      }
    ]
  }

  const statusChartData = {
    labels: stats?.statusDistribution.map(item => item.status.replace('-', ' ')) || [],
    datasets: [
      {
        data: stats?.statusDistribution.map(item => item.count) || [],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
        borderColor: ['#d97706', '#1d4ed8', '#059669', '#dc2626'],
        borderWidth: 2
      }
    ]
  }

  const trendChartData = {
    labels: stats?.monthlyTrends.map(item => item.month) || [],
    datasets: [
      {
        label: 'Submitted',
        data: stats?.monthlyTrends.map(item => item.submitted) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Resolved',
        data: stats?.monthlyTrends.map(item => item.resolved) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const wardChartData = {
    labels: stats?.wardWiseData.map(item => `Ward ${item.ward}`) || [],
    datasets: [
      {
        label: 'Grievances',
        data: stats?.wardWiseData.map(item => item.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#1d4ed8',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
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
          <h2 className="text-3xl font-bold">Municipal Services Map</h2>
          <p className="text-muted-foreground">Analytics and geographical visualization of municipal services</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="7" value="7">7 Days</SelectItem>
              <SelectItem key="30" value="30">30 Days</SelectItem>
              <SelectItem key="90" value="90">90 Days</SelectItem>
              <SelectItem key="365" value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGrievances || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <MapPin className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pendingGrievances || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting resolution
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.resolvedGrievances || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <PieChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageResolutionTime || 0}</div>
            <p className="text-xs text-muted-foreground">
              Days average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Distribution
            </CardTitle>
            <CardDescription>Grievances by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={categoryChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>Current status of all grievances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Submission and resolution trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Ward-wise Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ward-wise Distribution
            </CardTitle>
            <CardDescription>Grievances by municipal ward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={wardChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Municipal Services Map
          </CardTitle>
          <CardDescription>Geographical distribution of grievances and municipal services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden">
            <InteractiveMap 
              grievances={grievances.filter(g => 
                selectedCategory === 'all' || g.category === selectedCategory
              ).map(g => ({
                ...g,
                created_at: g.createdAt,
                coordinates: [g.location.coordinates.lat, g.location.coordinates.lng] as [number, number],
                location: g.location.address,
                ward_number: g.location.ward?.toString()
              }))} 
              categories={categories} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Key performance indicators for municipal services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalGrievances || 0}</div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats ? Math.round((stats.resolvedGrievances / stats.totalGrievances) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Resolution Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats?.averageResolutionTime || 0}</div>
              <div className="text-sm text-muted-foreground">Avg. Days to Resolve</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Service Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MunicipalMap
