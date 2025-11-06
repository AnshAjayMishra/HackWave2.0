import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
// @ts-ignore: Ignore missing type declarations for global CSS import
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Janvaani - Voice Based AI Assistant for Municipal Services ',
  description: 'Janvaani is a voice-based AI assistant designed to help users navigate municipal services and access information quickly and efficiently.',
  generator: 'Janvaani',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
