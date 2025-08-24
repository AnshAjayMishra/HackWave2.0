// Configuration file for frontend application
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', // Frontend API routes
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3000', // Backend FastAPI
    timeout: 10000,
  },
  
  // Backend service endpoints
  endpoints: {
    auth: {
      sendOtp: '/api/send-otp',
      verifyOtp: '/api/verify-otp',
      resendOtp: '/api/resend-otp',
      getCurrentUser: '/api/get-current-user',
      updateUser: '/api/update-user',
    },
    grievances: {
      categories: '/api/grievances/categories',
      create: '/api/grievances',
      list: '/api/grievances',
      update: '/api/grievances',
      delete: '/api/grievances',
    },
    certificates: {
      apply: '/api/certificates/apply',
      list: '/api/certificates',
      status: '/api/certificates/status',
    },
    admin: {
      stats: '/api/admin/stats',
      grievances: '/api/admin/grievances',
      overdue: '/api/admin/overdue',
      search: '/api/admin/search',
    },
  },
  
  // Twilio Configuration (for development mode fallback)
  twilio: {
    developmentMode: process.env.DEVELOPMENT_MODE === 'true',
    devOtp: process.env.DEV_OTP || '123456', // Default OTP for development
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  
  // Map Configuration
  map: {
    defaultCenter: {
      lat: 23.2599, // Bhopal coordinates
      lng: 77.4126,
    },
    defaultZoom: 12,
    maxZoom: 18,
    minZoom: 8,
  },
  
  // Chart Configuration
  charts: {
    defaultColors: [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // yellow
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
    ],
  },
  
  // Application Configuration
  app: {
    name: 'JanVaani Municipal Services',
    version: '2.0.0',
    supportEmail: 'support@janvaani.gov.in',
    supportPhone: '+91-755-XXXXXXX',
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // File upload limits
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  
  // Development flags
  features: {
    enableMockData: process.env.NODE_ENV === 'development',
    enableLogging: process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableMockPayments: process.env.DEVELOPMENT_MODE === 'true',
  },
  
  // Payment Configuration
  payment: {
    razorpay: {
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      mockMode: process.env.DEVELOPMENT_MODE === 'true',
    },
  },
} as const

// Type exports
export type Config = typeof config
export type ApiEndpoints = typeof config.endpoints
