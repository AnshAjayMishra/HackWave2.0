"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/user-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Globe, 
  Search,
  Calendar,
  Download,
  Filter,
  Eye,
  MousePointer,
  Clock,
  MapPin,
  Mic,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts'
import { 
  useAdminStats, 
  useAdminGrievances, 
  useOverdueGrievances, 
  transformStatsForCharts,
  getStatusColor,
  getPriorityColor,
  type Grievance 
} from '@/lib/admin-real-data'

export default function AdminPanel() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useUser()
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  
  // Real data hooks
  const { data: adminStats, loading: statsLoading, error: statsError } = useAdminStats()
  const { data: grievancesData, loading: grievancesLoading, error: grievancesError } = useAdminGrievances({ limit: 50 })
  const { data: overdueData, loading: overdueLoading, error: overdueError } = useOverdueGrievances()

  useEffect(() => {
    console.log('Auth status:', { isLoading, isAuthenticated, user })
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router, user])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Auth: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Not authenticated. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Transform real data for charts
  const chartData = transformStatsForCharts(adminStats?.stats)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">JanVaani Admin Panel</h1>
              <p className="text-muted-foreground">Municipal Grievance Management & Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{adminStats?.stats?.total_grievances || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total grievances in system
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Resolution</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{adminStats?.stats?.pending_grievances || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting resolution
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{adminStats?.stats?.resolved_grievances || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent (7 days)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{adminStats?.stats?.recent_grievances || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    New this week
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="data">Data Insights</TabsTrigger>
            <TabsTrigger value="grievances">All Grievances</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Grievance Activity Over Time</CardTitle>
                  <CardDescription>Daily grievance submissions and resolutions</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData.userActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="requests" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Service Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Most common grievance categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={chartData.serviceUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="service" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="requests" fill="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#82ca9d" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Status Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Current grievance status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pending', value: adminStats?.stats?.pending_grievances || 0, fill: '#FFBB28' },
                            { name: 'Resolved', value: adminStats?.stats?.resolved_grievances || 0, fill: '#00C49F' },
                            { name: 'Total', value: (adminStats?.stats?.total_grievances || 0) - (adminStats?.stats?.pending_grievances || 0) - (adminStats?.stats?.resolved_grievances || 0), fill: '#8884d8' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          dataKey="value"
                        >
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Recent grievance trends and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={chartData.performanceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#8884d8" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="avgResponseTime" stroke="#82ca9d" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Heatmap Tab */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Heatmap</CardTitle>
                <CardDescription>User activity patterns by hour and day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Day Labels */}
                  <div className="flex justify-end space-x-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="w-12 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="space-y-1">
                        <div className="text-xs text-muted-foreground text-center h-6 flex items-center justify-center">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex]
                          // Use real activity data or placeholder
                          const value = Math.floor(Math.random() * 50) + 10
                          return (
                            <div
                              key={`${hour}-${day}`}
                              className={`w-12 h-8 rounded bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-xs font-medium transition-colors hover:scale-110 cursor-pointer`}
                              title={`${day} ${hour.toString().padStart(2, '0')}:00 - ${value} activity`}
                            >
                              {value}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Simple legend */}
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <span className="text-sm text-muted-foreground">Activity Level: Low to High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Insights Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Grievance Categories</CardTitle>
                  <CardDescription>Most common grievance types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {grievancesLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-100 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-12"></div>
                            <div className="h-3 bg-gray-100 rounded w-8"></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      chartData.serviceUsage.slice(0, 5).map((category, index) => (
                        <div key={category.category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{category.service}</p>
                              <p className="text-sm text-muted-foreground">{category.requests} grievances</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={getStatusColor('good')}>
                              {category.category}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Grievances */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grievances</CardTitle>
                  <CardDescription>Latest submitted grievances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {grievancesLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                          <div className="flex justify-between items-start">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                          </div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                      ))
                    ) : grievancesData?.grievances ? (
                      grievancesData.grievances.slice(0, 5).map((grievance) => (
                        <div key={grievance._id} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{grievance.title}</h4>
                            <Badge className={getStatusColor(grievance.status)} variant="secondary">
                              {grievance.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{grievance.grievance_id}</span>
                            <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {grievance.description.substring(0, 100)}...
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No grievances found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Grievances Tab */}
          <TabsContent value="grievances" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Grievances</CardTitle>
                <CardDescription>Complete list of submitted grievances with their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {grievancesLoading ? (
                  <div className="space-y-4">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-100 rounded w-20"></div>
                          <div className="h-4 bg-gray-100 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : grievancesData?.grievances && grievancesData.grievances.length > 0 ? (
                  <div className="space-y-4">
                    {grievancesData.grievances.map((grievance) => (
                      <div key={grievance._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{grievance.title}</h4>
                            <Badge className={getPriorityColor(grievance.priority)} variant="secondary">
                              {grievance.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {grievance.description.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>ID: {grievance.grievance_id}</span>
                            <span>Category: {grievance.category.replace('_', ' ')}</span>
                            <span>Location: {grievance.location}</span>
                            <span>Submitted: {new Date(grievance.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(grievance.status)}>
                            {grievance.status.replace('_', ' ')}
                          </Badge>
                          {grievance.assigned_to && (
                            <p className="text-xs text-muted-foreground">
                              Assigned to: {grievance.assigned_to}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination Info */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {grievancesData.grievances.length} of {grievancesData.total_count} grievances
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No grievances found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  )
} 