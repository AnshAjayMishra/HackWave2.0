"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/contexts/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Settings, BarChart3, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react'

interface AdminStats {
  success: boolean;
  stats?: {
    total_grievances: number;
    pending_grievances: number;
    resolved_grievances: number;
    recent_grievances: number;
    detailed_stats: any[];
  };
  error?: string;
}

interface Grievance {
  _id: string;
  grievance_id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  user_mobile: string;
}

interface AdminGrievances {
  success: boolean;
  grievances?: Grievance[];
  total_count?: number;
  error?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useUser();
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [recentGrievances, setRecentGrievances] = useState<AdminGrievances | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch admin statistics
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch admin stats
        const statsResponse = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setAdminStats(statsData);
        }

        // Fetch recent grievances
        const grievancesResponse = await fetch('/api/admin/grievances?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (grievancesResponse.ok) {
          const grievancesData = await grievancesResponse.json();
          setRecentGrievances(grievancesData);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-primary flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-primary">
      {/* Header */}
      <header className="bg-[#121212] border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">JanVaani Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Welcome back!
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Full Admin Panel
                </Button>
              </Link>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary text-black">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-[#121212] border-primary/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Grievances */}
            <Card className="bg-[#121212] border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Grievances</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {adminStats?.stats?.total_grievances || 0}
                </div>
                <p className="text-xs text-gray-400">
                  All grievances in system
                </p>
              </CardContent>
            </Card>

            {/* Pending Grievances */}
            <Card className="bg-[#121212] border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pending Grievances</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {adminStats?.stats?.pending_grievances || 0}
                </div>
                <p className="text-xs text-gray-400">
                  Awaiting resolution
                </p>
              </CardContent>
            </Card>

            {/* Resolved Grievances */}
            <Card className="bg-[#121212] border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Resolved Grievances</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {adminStats?.stats?.resolved_grievances || 0}
                </div>
                <p className="text-xs text-gray-400">
                  Successfully completed
                </p>
              </CardContent>
            </Card>

            {/* Recent Grievances */}
            <Card className="bg-[#121212] border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Recent (7 days)</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {adminStats?.stats?.recent_grievances || 0}
                </div>
                <p className="text-xs text-gray-400">
                  New this week
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-[#121212] border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <span>Admin Profile</span>
                <Badge variant="outline" className="border-primary text-primary">
                  Active
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your administrator account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg bg-primary text-black">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">{user?.name || 'Admin User'}</p>
                  <p className="text-sm text-gray-400">{user?.email || 'admin@janvaani.com'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mobile:</span>
                  <span className="text-primary">{user?.mobile || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Role:</span>
                  <span className="text-primary">Administrator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-primary">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#121212] border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Admin Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Quick administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin" className="w-full block">
                <Button className="w-full justify-start bg-primary text-black hover:bg-primary/80" variant="default">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Full Admin Dashboard
                </Button>
              </Link>
              <Button className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-black" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-black" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
              <Button className="w-full justify-start border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                View Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Recent Grievances */}
          <Card className="bg-[#121212] border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Recent Grievances</CardTitle>
              <CardDescription className="text-gray-400">
                Latest submissions requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGrievances?.grievances && recentGrievances.grievances.length > 0 ? (
                recentGrievances.grievances.slice(0, 3).map((grievance) => (
                  <div key={grievance._id} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      grievance.status === 'RESOLVED' ? 'bg-green-500' :
                      grievance.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                      grievance.status === 'UNDER_REVIEW' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <span className="text-primary font-medium">{grievance.title.substring(0, 30)}...</span>
                      <div className="text-xs text-gray-400">
                        {grievance.grievance_id} • {new Date(grievance.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No recent grievances</p>
                </div>
              )}
              <Link href="/admin" className="w-full block">
                <Button className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-black" variant="outline">
                  View All Grievances
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Welcome to the JanVaani Admin Dashboard, {user?.name || 'Administrator'}! 🎉
              </h2>
              <p className="text-gray-300">
                Monitor and manage municipal grievances, track performance metrics, and ensure efficient resolution of citizen concerns.
                {adminStats?.stats && ` Currently managing ${adminStats.stats.total_grievances} total grievances with ${adminStats.stats.pending_grievances} pending resolution.`}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 