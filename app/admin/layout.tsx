import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - Janvaani',
  description: 'Voice AI Assistant Analytics & Insights Dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
} 