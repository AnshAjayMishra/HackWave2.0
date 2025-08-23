import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { UserProvider } from '@/contexts/user-context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Janvaani - Voice-Based AI Assistant for Municipal Services',
  description: 'Transform how citizens interact with local government. Get instant answers, submit requests, and access services through natural voice conversations.',
  generator: 'Next.js',
  keywords: ['AI Assistant', 'Municipal Services', 'Voice Technology', 'Government Services', 'Smart City', 'Citizen Services'],
  authors: [{ name: 'Janvaani Team' }],
  openGraph: {
    title: 'Janvaani - Voice-Based AI Assistant for Municipal Services',
    description: 'Transform how citizens interact with local government through voice-based AI technology.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
