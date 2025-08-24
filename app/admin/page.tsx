"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MunicipalMap from "@/components/municipal-map"
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
  Info
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts'
import { adminData, getStatusColor, getPriorityColor } from '@/lib/admin-data'

export default function AdminPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Janvaani Admin Panel</h1>
              <p className="text-muted-foreground">Voice AI Assistant Analytics & Insights</p>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voice Requests</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+0.3s</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="heatmap">Municipal Map</TabsTrigger>
            <TabsTrigger value="data">Data Insights</TabsTrigger>
            <TabsTrigger value="seo">SEO & Performance</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Over Time</CardTitle>
                  <CardDescription>Daily user activity and voice requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={adminData.userActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="requests" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Usage & Satisfaction</CardTitle>
                  <CardDescription>Most requested services and user satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={adminData.serviceUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="requests" fill="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Language Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>User language preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={adminData.languageUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ language, percentage }) => `${language} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="users"
                      >
                        {adminData.languageUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Success rate and response time over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={adminData.performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#8884d8" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="avgResponseTime" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Municipal Map Tab */}
          <TabsContent value="heatmap" className="space-y-6">
            <MunicipalMap />
          </TabsContent>

          {/* Data Insights Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Requested Services</CardTitle>
                  <CardDescription>Most popular municipal services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.serviceUsage.map((service, index) => (
                      <div key={service.service} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{service.service}</p>
                            <p className="text-sm text-muted-foreground">{service.requests} requests</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{service.satisfaction}★</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{service.avgResponseTime}s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>User distribution and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Age Groups</h4>
                      <div className="space-y-2">
                        {adminData.userDemographics.ageGroups.map((group) => (
                          <div key={group.range} className="flex items-center justify-between">
                            <span className="text-sm">{group.range}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{group.percentage}%</Badge>
                              <span className="text-xs text-muted-foreground">{group.users} users</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Device Types</h4>
                      <div className="space-y-2">
                        {adminData.userDemographics.deviceTypes.map((device) => (
                          <div key={device.type} className="flex items-center justify-between">
                            <span className="text-sm">{device.type}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{device.percentage}%</Badge>
                              <span className="text-xs text-muted-foreground">{device.users} users</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Core Web Vitals and performance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.seoMetrics.map((item) => (
                      <div key={item.metric} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{item.value}</span>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SEO Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Recommendations</CardTitle>
                  <CardDescription>Actionable insights to improve performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.seoRecommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-primary">{rec.impact}</span>
                          <span className="text-muted-foreground">Effort: {rec.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Error Analysis Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>Common errors and their solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.errorAnalysis.map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          error.impact === 'High' ? 'bg-red-500' : 
                          error.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium">{error.error}</h4>
                          <p className="text-sm text-muted-foreground">{error.solution}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{error.count} occurrences</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{error.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 