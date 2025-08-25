"use client"

import { useUser } from '@/contexts/user-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Settings, BarChart3, MapPin, FileText, AlertCircle, Users, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import GrievanceManagement from '@/components/grievance-management'
import CertificateManagement from '@/components/certificate-management'
import RevenueManagement from '@/components/revenue-management'
import RazorpayTester from '@/components/razorpay-tester'
import { FooterSection } from '@/components/footer-section'

export default function DashboardPage() {
  const { user, isLoading, logout } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardStats, setDashboardStats] = useState({
    profileCompletion: 0,
    activeGrievances: 1,
    certificateApplications: 3,
    responseTime: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetchDashboardStats()
      fetchRecentActivities()
    }
  }, [isLoading, user, router])

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true)
      let activeGrievances = 0
      let certificateApplications = 0
      let profileCompletion = 0
      
      // Calculate profile completion based on user data
      if (user) {
        let completedFields = 0
        const totalFields = 4 // name, email, mobile, verified
        
        if (user.name && user.name.trim()) completedFields++
        if (user.email && user.email.trim()) completedFields++
        if (user.mobile && user.mobile.trim()) completedFields++
        if (user.verified) completedFields++
        
        profileCompletion = Math.round((completedFields / totalFields) * 100)
        console.log('Profile completion calculation:', {
          user: { name: user.name, email: user.email, mobile: user.mobile, verified: user.verified },
          completedFields,
          totalFields,
          profileCompletion
        })
      } else {
        console.warn('User object is undefined for profile completion calculation')
        profileCompletion = 0
      }

      // Fetch grievances count with error handling
      try {
        const grievancesResponse = await fetch('/api/grievances', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        
        if (grievancesResponse.ok) {
          const grievancesData = await grievancesResponse.json()
          activeGrievances = grievancesData.grievances?.filter((g: any) => 
            ['pending', 'in-progress'].includes(g.status)
          ).length || 0
        }
      } catch (error) {
        console.warn('Failed to fetch grievances:', error)
      }

      // Fetch certificate applications count with error handling
      try {
        const certificatesResponse = await fetch('/api/certificates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        
        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json()
          certificateApplications = certificatesData.applications?.length || 0
        }
      } catch (error) {
        console.warn('Failed to fetch certificates:', error)
      }

      // Calculate average response time based on completed grievances/certificates
      let responseTime = 5.2 // Default fallback
      try {
        const completed = await Promise.all([
          fetch('/api/grievances', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          }).then(res => res.ok ? res.json() : { grievances: [] }),
          fetch('/api/certificates', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          }).then(res => res.ok ? res.json() : { applications: [] })
        ])
        
        const completedItems = [
          ...(completed[0].grievances?.filter((g: any) => g.status === 'resolved') || []),
          ...(completed[1].applications?.filter((a: any) => a.status === 'approved') || [])
        ]
        
        if (completedItems.length > 0) {
          const totalDays = completedItems.reduce((sum: number, item: any) => {
            const created = new Date(item.createdAt || item.submittedAt)
            const completed = new Date(item.updatedAt || item.approvedAt)
            const diffDays = Math.max(1, Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))
            return sum + diffDays
          }, 0)
          responseTime = Math.round((totalDays / completedItems.length) * 10) / 10
        }
      } catch (error) {
        console.warn('Failed to calculate response time:', error)
      }

      setDashboardStats({
        profileCompletion,
        activeGrievances,
        certificateApplications,
        responseTime
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Keep default values on error
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await fetch('/api/user/activities?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecentActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header with Teal Gradient Theme */}
        <div className="relative">
          {/* Teal Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/25 to-emerald-500/20 rounded-2xl blur-3xl"></div>
          
          {/* Main Header Card with Teal Theme */}
          <Card className="relative bg-gradient-to-br from-teal-800/95 via-cyan-900/90 to-emerald-900/95 backdrop-blur-xl border border-teal-300/20 shadow-2xl shadow-teal-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-teal-300 to-cyan-500 rounded-full shadow-lg shadow-teal-400/50"></div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-teal-100 to-cyan-100 bg-clip-text text-transparent">
                      Welcome back, {user.name ? user.name.split(' ')[0] : 'User'}!
                    </h1>
                  </div>
                  <p className="text-teal-100/90 text-base ml-5 font-medium">
                    Manage your municipal services and track your applications
                  </p>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 ml-5 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-green-300/90 font-medium">All systems operational</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Compact User Profile Section */}
                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-xl p-3 border border-teal-300/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-teal-300/40 shadow-lg">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="hidden lg:block space-y-0.5">
                      <div className="text-sm font-semibold text-white">{user.name || 'User'}</div>
                      <div className="text-xs text-teal-100/80">{user.email || user.mobile}</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-300/90 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="border-teal-300/40 text-teal-00 hover:bg-teal-200/20 hover:border-teal-300/60 hover:text-gray-400 backdrop-blur-sm transition-all duration-300 shadow-lg px-4"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Profile Completion</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {loadingStats ? '...' : `${dashboardStats.profileCompletion || 0}%`}
              </div>
              <p className="text-xs text-green-600/70 font-medium">
                {(dashboardStats.profileCompletion || 0) === 100 ? 'Your profile is complete' : 'Profile completion progress'}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20 rounded-full">
                <div 
                  className={`h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ${
                    (dashboardStats.profileCompletion || 0) === 100 ? 'w-full' : 
                    (dashboardStats.profileCompletion || 0) >= 75 ? 'w-3/4' :
                    (dashboardStats.profileCompletion || 0) >= 50 ? 'w-1/2' :
                    (dashboardStats.profileCompletion || 0) >= 25 ? 'w-1/4' : 'w-1/12'
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Active Grievances</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-blue-600 mb-1">{loadingStats ? '...' : dashboardStats.activeGrievances}</div>
              <p className="text-xs text-blue-600/70 font-medium">
                Currently pending/in-progress
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/20 rounded-full">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ${
                    dashboardStats.activeGrievances === 0 ? 'w-0' :
                    dashboardStats.activeGrievances >= 10 ? 'w-full' :
                    dashboardStats.activeGrievances >= 7 ? 'w-3/4' :
                    dashboardStats.activeGrievances >= 4 ? 'w-1/2' :
                    dashboardStats.activeGrievances >= 2 ? 'w-1/4' : 'w-1/12'
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-full blur-2xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Certificate Applications</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-purple-600 mb-1">{loadingStats ? '...' : dashboardStats.certificateApplications}</div>
              <p className="text-xs text-purple-600/70 font-medium">
                Total applications
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500/20 rounded-full">
                <div 
                  className={`h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500 ${
                    dashboardStats.certificateApplications === 0 ? 'w-0' :
                    dashboardStats.certificateApplications >= 10 ? 'w-full' :
                    dashboardStats.certificateApplications >= 7 ? 'w-3/4' :
                    dashboardStats.certificateApplications >= 4 ? 'w-1/2' :
                    dashboardStats.certificateApplications >= 2 ? 'w-1/4' : 'w-1/12'
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-2xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">Response Time</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-orange-600 mb-1">{loadingStats ? '...' : dashboardStats.responseTime}</div>
              <p className="text-xs text-orange-600/70 font-medium">
                Average days
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500/20 rounded-full">
                <div 
                  className={`h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ${
                    dashboardStats.responseTime <= 2 ? 'w-1/4' :
                    dashboardStats.responseTime <= 4 ? 'w-1/2' :
                    dashboardStats.responseTime <= 6 ? 'w-3/4' : 'w-full'
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content Tabs */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 rounded-xl blur-2xl"></div>
              <TabsList className="relative bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg grid w-full lg:w-auto grid-cols-3 lg:grid-cols-5 p-1">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="grievances" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Grievances</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="certificates" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Certificates</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="revenue" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Bills & Payments</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="testing" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Testing</span>
                </TabsTrigger>
              </TabsList>
            </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Profile Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your account details and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{user.name || 'User Name'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email || 'email@example.com'}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{user.mobile}</span>
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">Phone Verified</p>
                      <Badge variant={user.verified ? "default" : "destructive"} className="mt-1">
                        {user.verified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <span className="text-sm text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest interactions with municipal services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingActivities ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start space-x-3 animate-pulse">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-5 bg-gray-300 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.color === 'green' ? 'bg-green-500' :
                            activity.color === 'blue' ? 'bg-blue-500' :
                            activity.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()} 
                              {` (${Math.ceil((Date.now() - new Date(activity.date).getTime()) / (1000 * 60 * 60 * 24))} days ago)`}
                            </p>
                          </div>
                          <Badge 
                            variant={activity.status === 'approved' || activity.status === 'completed' || activity.status === 'resolved' ? 'default' : 'outline'} 
                            className={`text-xs ${
                              activity.status === 'approved' || activity.status === 'completed' || activity.status === 'resolved' ? 'bg-green-500' :
                              activity.status === 'pending' ? 'text-yellow-600' :
                              activity.status === 'in-progress' || activity.status === 'under_review' ? 'text-blue-600' : ''
                            }`}
                          >
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activities found</p>
                        <p className="text-xs">Your activities will appear here when you use our services</p>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and services you might need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('grievances')}
                  >
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium">Report Issue</span>
                    <span className="text-xs text-muted-foreground text-center">Submit a new grievance</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('certificates')}
                  >
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">Apply Certificate</span>
                    <span className="text-xs text-muted-foreground text-center">Birth, Death, Marriage</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('revenue')}
                  >
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Pay Bills</span>
                    <span className="text-xs text-muted-foreground text-center">Bills and payments</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('overview')}
                  >
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">My Activity</span>
                    <span className="text-xs text-muted-foreground text-center">View your service history</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grievances Tab */}
          <TabsContent value="grievances">
            <GrievanceManagement />
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <CertificateManagement />
          </TabsContent>

          {/* Revenue & Bills Tab */}
          <TabsContent value="revenue">
            <RevenueManagement />
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Payment System Testing
                </CardTitle>
                <CardDescription>
                  Test both mock and real Razorpay payment integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RazorpayTester />
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
        <FooterSection/>
      </div>
    </div>
  )
} 