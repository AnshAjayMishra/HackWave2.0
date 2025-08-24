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
import { useEffect } from 'react'
import GrievanceManagement from '@/components/grievance-management'
import CertificateManagement from '@/components/certificate-management'
import MunicipalMap from '@/components/municipal-map'

export default function DashboardPage() {
  const { user, isLoading, logout } = useUser()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {user.name ? user.name.split(' ')[0] : 'User'}!</h1>
            <p className="text-muted-foreground text-lg">
              Manage your municipal services and track your applications
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user.name || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user.email || user.mobile}</div>
            </div>
            
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <p className="text-xs text-muted-foreground">
                Your profile is complete
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Grievances</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificate Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                1 pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2</div>
              <p className="text-xs text-muted-foreground">
                Average days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="grievances" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Grievances
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Municipal Map
            </TabsTrigger>
          </TabsList>

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
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Submitted grievance about street lighting</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                      <Badge variant="outline" className="text-xs">Pending</Badge>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Birth certificate application approved</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                      <Badge className="bg-green-500 text-xs">Approved</Badge>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile information updated</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    </div>
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
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium">Report Issue</span>
                    <span className="text-xs text-muted-foreground text-center">Submit a new grievance</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">Apply Certificate</span>
                    <span className="text-xs text-muted-foreground text-center">Birth, Death, Marriage</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <MapPin className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">View Map</span>
                    <span className="text-xs text-muted-foreground text-center">Municipal services map</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">Analytics</span>
                    <span className="text-xs text-muted-foreground text-center">View service statistics</span>
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

          {/* Municipal Map Tab */}
          <TabsContent value="map">
            <MunicipalMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 