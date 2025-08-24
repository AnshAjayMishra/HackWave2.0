'use client'

import { useState, useEffect } from 'react'
import { useUser } from '../contexts/user-context'
import { useRouter } from 'next/navigation'
import { useUserGrievances, useGrievanceStats, getStatusColor, getPriorityColor, formatDate, getStatusIcon } from '../../lib/user-grievances'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus, Filter } from 'lucide-react'
import GrievanceForm from '../../components/GrievanceForm'

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useUser()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch user grievances with filters
  const { data: grievancesData, loading: grievancesLoading, error: grievancesError, refetch } = useUserGrievances({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 10
  })

  // Calculate stats
  const stats = useGrievanceStats(grievancesData?.grievances || [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleGrievanceSuccess = () => {
    refetch()
    setShowCreateForm(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-600 text-lg">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JanVaani Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your grievances and track progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
              <p className="text-xs text-gray-600">{user?.mobile}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Error Alert */}
        {grievancesError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {grievancesError}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Grievances</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-700 mt-1">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
              <p className="text-xs text-yellow-700 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.in_progress}</div>
              <p className="text-xs text-orange-700 mt-1">Being processed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
              <p className="text-xs text-green-700 mt-1">Successfully closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Grievance
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grievances List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Your Grievances</CardTitle>
            <CardDescription>
              Track the status and progress of your submitted grievances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {grievancesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading grievances...</span>
              </div>
            ) : !grievancesData?.grievances?.length ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No grievances found</h3>
                <p className="text-gray-600 mb-4">
                  {statusFilter !== 'all' ? 'No grievances match your current filter.' : 'You haven\'t submitted any grievances yet.'}
                </p>
                <Button onClick={() => setShowCreateForm(true)} variant="outline">
                  Submit Your First Grievance
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {grievancesData.grievances.map((grievance) => (
                  <div
                    key={grievance._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getStatusIcon(grievance.status)}</span>
                          <h3 className="font-semibold text-gray-900">
                            {grievance.title}
                          </h3>
                          <Badge className={getStatusColor(grievance.status)}>
                            {grievance.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(grievance.priority)}>
                            {grievance.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {grievance.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>ID: {grievance.grievance_id}</span>
                          <span>Category: {grievance.category}</span>
                          <span>Submitted: {formatDate(grievance.created_at)}</span>
                          {grievance.location && (
                            <span>Location: {grievance.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Submit New
              </CardTitle>
              <CardDescription className="text-purple-700">
                Report a new issue or concern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowCreateForm(true)}
              >
                Create Grievance
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-900 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Track Progress
              </CardTitle>
              <CardDescription className="text-indigo-700">
                Monitor your grievance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-indigo-300 text-indigo-700">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Quick Help
              </CardTitle>
              <CardDescription className="text-teal-700">
                Get assistance and FAQs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-teal-300 text-teal-700">
                Help Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Grievance Form Modal */}
      <GrievanceForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleGrievanceSuccess}
      />
    </div>
  )
}
