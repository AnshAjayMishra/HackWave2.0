"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Globe, Shield, Clock } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const highlights = [
    {
      icon: Mic,
      title: "Voice-First",
      description: "Natural voice interactions"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "15+ languages supported"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Enterprise-grade security"
    },
    {
      icon: Clock,
      title: "24/7",
      description: "Always available"
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground w-fit mx-auto">
              🚀 Ready to Transform?
            </Badge>
            <CardTitle className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Start Your Journey to
              <span className="text-primary block">Smart Municipal Services</span>
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the revolution in citizen-government interaction. Our AI assistant is ready to transform how your community accesses municipal services.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-12 px-8">
            {/* Key Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <highlight.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{highlight.title}</h4>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-border hover:bg-muted px-8 py-4 text-lg font-semibold rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                No credit card required • Free trial available • Setup in minutes
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  GDPR Compliant
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  SOC 2 Certified
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  HIPAA Ready
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
