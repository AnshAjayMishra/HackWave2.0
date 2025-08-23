"use client"

import { useUser } from '@/contexts/user-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardPage() {
  const { user, isLoading, logout } = useUser()

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
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Welcome back!
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={logout} className="border-border hover:bg-muted">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <span>Profile Information</span>
                <Badge variant="outline" className="border-primary text-primary">
                  Active
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your personal details and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span className="text-foreground">{user.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="text-foreground">{user.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="text-foreground capitalize">{user.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" className="border-border hover:bg-muted">
                <span className="mr-2">📝</span>
                Edit Profile
              </Button>
              <Button className="w-full justify-start" variant="outline" className="border-border hover:bg-muted">
                <span className="mr-2">🔒</span>
                Change Password
              </Button>
              <Button className="w-full justify-start" variant="outline" className="border-border hover:bg-muted">
                <span className="mr-2">⚙️</span>
                Settings
              </Button>
              <Button className="w-full justify-start" variant="outline" className="border-border hover:bg-muted">
                <span className="mr-2">📧</span>
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-foreground">Profile completed successfully</span>
                <span className="text-muted-foreground text-xs">Just now</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Account created</span>
                <span className="text-muted-foreground text-xs">Today</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span className="text-foreground">Welcome email sent</span>
                <span className="text-muted-foreground text-xs">Today</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Welcome to your dashboard, {user.name}! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your account has been successfully created. You can now access all the features and manage your profile from this dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 