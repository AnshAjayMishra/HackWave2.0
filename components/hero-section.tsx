"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, Smartphone, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground">
              🚀 Revolutionizing Municipal Services
            </Badge>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Voice-Based AI Assistant for
              <span className="text-primary block">Municipal Services</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Transform how citizens interact with local government. Get instant answers, 
              submit requests, and access services through natural voice conversations.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="border-border hover:bg-muted px-8 py-4 text-lg font-semibold rounded-full">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Voice-First Interface</h3>
                  <p className="text-sm text-muted-foreground">Natural voice conversations</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">24/7 Availability</h3>
                  <p className="text-sm text-muted-foreground">Round-the-clock access</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Citizen-Centric</h3>
                  <p className="text-sm text-muted-foreground">Designed for accessibility</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              {/* Placeholder Illustration */}
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Voice AI Assistant</h3>
                <p className="text-muted-foreground">Municipal Services</p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-20 left-5 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center animate-pulse">
                <Smartphone className="w-6 h-6 text-secondary" />
              </div>
              <div className="absolute top-1/2 left-10 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Users className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
