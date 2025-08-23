// Mock data for admin panel analytics
export const adminData = {
  // User Activity Data
  userActivity: [
    { time: "00:00", users: 45, requests: 120, successRate: 94.2 },
    { time: "04:00", users: 23, requests: 67, successRate: 96.1 },
    { time: "08:00", users: 89, requests: 234, successRate: 93.8 },
    { time: "12:00", users: 156, requests: 445, successRate: 92.5 },
    { time: "16:00", users: 134, requests: 389, successRate: 94.7 },
    { time: "20:00", users: 98, requests: 267, successRate: 95.3 },
    { time: "24:00", users: 67, requests: 189, successRate: 96.8 }
  ],

  // Service Usage Data
  serviceUsage: [
    { service: "Water Bill", requests: 234, satisfaction: 4.2, avgResponseTime: 1.1, successRate: 96.5 },
    { service: "Property Tax", requests: 189, satisfaction: 4.5, avgResponseTime: 0.9, successRate: 98.2 },
    { service: "Building Permit", requests: 145, satisfaction: 4.1, avgResponseTime: 1.8, successRate: 89.3 },
    { service: "Garbage Collection", requests: 267, satisfaction: 4.3, avgResponseTime: 1.2, successRate: 94.7 },
    { service: "Street Light", requests: 98, satisfaction: 4.6, avgResponseTime: 0.8, successRate: 97.1 },
    { service: "Traffic Signal", requests: 76, satisfaction: 4.4, avgResponseTime: 1.0, successRate: 95.8 },
    { service: "Parking Permit", requests: 123, satisfaction: 4.0, avgResponseTime: 1.5, successRate: 91.2 },
    { service: "Business License", requests: 89, satisfaction: 4.3, avgResponseTime: 2.1, successRate: 87.6 }
  ],

  // Language Usage Data
  languageUsage: [
    { language: "English", users: 45, percentage: 45, satisfaction: 4.3, avgResponseTime: 1.2 },
    { language: "Hindi", users: 32, percentage: 32, satisfaction: 4.5, avgResponseTime: 1.1 },
    { language: "Gujarati", users: 15, percentage: 15, satisfaction: 4.2, avgResponseTime: 1.3 },
    { language: "Marathi", users: 8, percentage: 8, satisfaction: 4.4, avgResponseTime: 1.4 }
  ],

  // SEO Performance Data
  seoMetrics: [
    { metric: "Page Load Time", value: "1.2s", status: "good", trend: "+0.1s", target: "<1.5s" },
    { metric: "Mobile Score", value: "95/100", status: "excellent", trend: "+2", target: ">90" },
    { metric: "SEO Score", value: "88/100", status: "good", trend: "+3", target: ">85" },
    { metric: "Accessibility", value: "92/100", status: "excellent", trend: "+1", target: ">90" },
    { metric: "Best Practices", value: "87/100", status: "good", trend: "+4", target: ">85" },
    { metric: "Performance", value: "82/100", status: "good", trend: "+5", target: ">80" }
  ],

  // Heatmap Data (24 hours x 7 days)
  heatmapData: [
    // Monday
    { hour: 0, day: "Mon", value: 45, requests: 120, successRate: 94.2 },
    { hour: 4, day: "Mon", value: 23, requests: 67, successRate: 96.1 },
    { hour: 8, day: "Mon", value: 89, requests: 234, successRate: 93.8 },
    { hour: 12, day: "Mon", value: 156, requests: 445, successRate: 92.5 },
    { hour: 16, day: "Mon", value: 134, requests: 389, successRate: 94.7 },
    { hour: 20, day: "Mon", value: 98, requests: 267, successRate: 95.3 },
    // Tuesday
    { hour: 0, day: "Tue", value: 52, requests: 145, successRate: 95.1 },
    { hour: 4, day: "Tue", value: 28, requests: 78, successRate: 96.8 },
    { hour: 8, day: "Tue", value: 94, requests: 256, successRate: 94.2 },
    { hour: 12, day: "Tue", value: 167, requests: 478, successRate: 93.1 },
    { hour: 16, day: "Tue", value: 142, requests: 412, successRate: 95.6 },
    { hour: 20, day: "Tue", value: 105, requests: 298, successRate: 96.2 },
    // Wednesday
    { hour: 0, day: "Wed", value: 48, requests: 134, successRate: 94.8 },
    { hour: 4, day: "Wed", value: 25, requests: 72, successRate: 97.2 },
    { hour: 8, day: "Wed", value: 91, requests: 248, successRate: 94.5 },
    { hour: 12, day: "Wed", value: 159, requests: 456, successRate: 93.8 },
    { hour: 16, day: "Wed", value: 138, requests: 398, successRate: 95.1 },
    { hour: 20, day: "Wed", value: 101, requests: 287, successRate: 96.5 },
    // Thursday
    { hour: 0, day: "Thu", value: 51, requests: 142, successRate: 95.3 },
    { hour: 4, day: "Thu", value: 27, requests: 75, successRate: 97.1 },
    { hour: 8, day: "Thu", value: 93, requests: 251, successRate: 94.7 },
    { hour: 12, day: "Thu", value: 164, requests: 467, successRate: 93.5 },
    { hour: 16, day: "Thu", value: 141, requests: 405, successRate: 95.8 },
    { hour: 20, day: "Thu", value: 103, requests: 291, successRate: 96.7 },
    // Friday
    { hour: 0, day: "Fri", value: 55, requests: 156, successRate: 95.8 },
    { hour: 4, day: "Fri", value: 30, requests: 82, successRate: 97.5 },
    { hour: 8, day: "Fri", value: 97, requests: 267, successRate: 95.2 },
    { hour: 12, day: "Fri", value: 172, requests: 489, successRate: 94.1 },
    { hour: 16, day: "Fri", value: 148, requests: 423, successRate: 96.2 },
    { hour: 20, day: "Fri", value: 112, requests: 312, successRate: 97.1 },
    // Saturday
    { hour: 0, day: "Sat", value: 42, requests: 118, successRate: 96.2 },
    { hour: 4, day: "Sat", value: 20, requests: 58, successRate: 98.1 },
    { hour: 8, day: "Sat", value: 78, requests: 212, successRate: 95.8 },
    { hour: 12, day: "Sat", value: 134, requests: 378, successRate: 94.7 },
    { hour: 16, day: "Sat", value: 118, requests: 334, successRate: 96.5 },
    { hour: 20, day: "Sat", value: 89, requests: 245, successRate: 97.2 },
    // Sunday
    { hour: 0, day: "Sun", value: 38, requests: 108, successRate: 96.8 },
    { hour: 4, day: "Sun", value: 18, requests: 52, successRate: 98.5 },
    { hour: 8, day: "Sun", value: 72, requests: 198, successRate: 96.2 },
    { hour: 12, day: "Sun", value: 128, requests: 356, successRate: 95.1 },
    { hour: 16, day: "Sun", value: 112, requests: 312, successRate: 97.3 },
    { hour: 20, day: "Sun", value: 82, requests: 228, successRate: 98.1 }
  ],

  // User Demographics
  userDemographics: {
    ageGroups: [
      { range: "18-25", percentage: 23, users: 2954, avgSatisfaction: 4.2 },
      { range: "26-35", percentage: 34, users: 4368, avgSatisfaction: 4.4 },
      { range: "36-50", percentage: 28, users: 3597, avgSatisfaction: 4.3 },
      { range: "50+", percentage: 15, users: 1928, avgSatisfaction: 4.1 }
    ],
    deviceTypes: [
      { type: "Mobile", percentage: 67, users: 8607, avgSatisfaction: 4.3 },
      { type: "Desktop", percentage: 28, users: 3597, avgSatisfaction: 4.4 },
      { type: "Tablet", percentage: 5, users: 643, avgSatisfaction: 4.2 }
    ],
    locations: [
      { city: "Mumbai", percentage: 25, users: 3212, avgSatisfaction: 4.3 },
      { city: "Delhi", percentage: 22, users: 2826, avgSatisfaction: 4.4 },
      { city: "Bangalore", percentage: 18, users: 2312, avgSatisfaction: 4.2 },
      { city: "Chennai", percentage: 15, users: 1927, avgSatisfaction: 4.1 },
      { city: "Others", percentage: 20, users: 2569, avgSatisfaction: 4.3 }
    ]
  },

  // Performance Trends (Last 30 days)
  performanceTrends: [
    { date: "2024-01-01", users: 12000, requests: 85000, successRate: 93.5, avgResponseTime: 1.3 },
    { date: "2024-01-02", users: 12100, requests: 85200, successRate: 93.8, avgResponseTime: 1.2 },
    { date: "2024-01-03", users: 12200, requests: 85800, successRate: 94.1, avgResponseTime: 1.2 },
    { date: "2024-01-04", users: 12300, requests: 86400, successRate: 94.3, avgResponseTime: 1.1 },
    { date: "2024-01-05", users: 12400, requests: 87000, successRate: 94.5, avgResponseTime: 1.1 },
    { date: "2024-01-06", users: 12500, requests: 87600, successRate: 94.7, avgResponseTime: 1.0 },
    { date: "2024-01-07", users: 12600, requests: 88200, successRate: 94.9, avgResponseTime: 1.0 },
    { date: "2024-01-08", users: 12700, requests: 88800, successRate: 95.1, avgResponseTime: 0.9 },
    { date: "2024-01-09", users: 12800, requests: 89400, successRate: 95.3, avgResponseTime: 0.9 },
    { date: "2024-01-10", users: 12847, requests: 89234, successRate: 94.2, avgResponseTime: 1.2 }
  ],

  // Error Analysis
  errorAnalysis: [
    { error: "Voice Recognition Failed", count: 234, percentage: 0.26, impact: "Low", solution: "Improve audio quality detection" },
    { error: "Service Not Found", count: 156, percentage: 0.17, impact: "Medium", solution: "Expand service coverage" },
    { error: "Timeout Error", count: 89, percentage: 0.10, impact: "High", solution: "Optimize response time" },
    { error: "Language Not Supported", count: 67, percentage: 0.07, impact: "Medium", solution: "Add more language support" },
    { error: "Network Error", count: 45, percentage: 0.05, impact: "Low", solution: "Improve connection handling" }
  ],

  // SEO Recommendations
  seoRecommendations: [
    {
      category: "Performance",
      priority: "High",
      title: "Optimize Image Loading",
      description: "Implement lazy loading for images to improve page load times",
      impact: "Could improve performance score by 8-12 points",
      effort: "Medium"
    },
    {
      category: "SEO",
      priority: "Medium",
      title: "Add Structured Data",
      description: "Implement JSON-LD structured data for better search engine understanding",
      impact: "Could improve SEO score by 5-8 points",
      effort: "Low"
    },
    {
      category: "Accessibility",
      priority: "Low",
      title: "Improve Color Contrast",
      description: "Enhance color contrast ratios for better accessibility",
      impact: "Could improve accessibility score by 2-3 points",
      effort: "Low"
    }
  ]
}

// Helper functions
export const getHeatmapColor = (value: number) => {
  if (value < 50) return "bg-blue-100 dark:bg-blue-900/20"
  if (value < 100) return "bg-blue-200 dark:bg-blue-800/30"
  if (value < 150) return "bg-blue-300 dark:bg-blue-700/40"
  if (value < 200) return "bg-blue-400 dark:bg-blue-600/50"
  return "bg-blue-500 dark:bg-blue-500/60"
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "good": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "poor": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "Low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
} 