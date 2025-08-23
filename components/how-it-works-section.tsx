"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Brain, CheckCircle, Smartphone } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: Mic,
      title: "Speak Naturally",
      description: "Simply speak your request in your preferred language. The AI understands natural conversation and context.",
      details: [
        "Multi-language support",
        "Natural speech recognition",
        "Context-aware understanding"
      ]
    },
    {
      step: "02",
      icon: Brain,
      title: "AI Processing",
      description: "Our advanced AI analyzes your request, identifies the relevant service, and processes your needs intelligently.",
      details: [
        "Intent recognition",
        "Service mapping",
        "Smart routing"
      ]
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Instant Results",
      description: "Get immediate answers, submit requests, or receive confirmation of your service application.",
      details: [
        "Real-time responses",
        "Instant confirmations",
        "Status updates"
      ]
    },
    {
      step: "04",
      icon: Smartphone,
      title: "Track & Manage",
      description: "Monitor your requests, receive notifications, and manage all your municipal service interactions.",
      details: [
        "Request tracking",
        "Smart notifications",
        "Service history"
      ]
    }
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground">
          🔄 Simple Process
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          How It Works in
          <span className="text-primary block">4 Simple Steps</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Getting municipal services has never been easier. Our AI assistant makes the process simple and intuitive.
        </p>
      </div>

      {/* Central Illustration */}
      <div className="flex justify-center mb-16">
        <div className="relative w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          {/* Central Icon */}
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          
          {/* Process Icons Around */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
            <Mic className="w-8 h-8 text-secondary" />
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-secondary" />
          </div>
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-2 border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-sm font-bold">
                  {step.step}
                </Badge>
              </div>
              <CardTitle className="text-xl text-foreground mb-3">{step.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed mb-4">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Lines for Desktop */}
      <div className="hidden lg:block relative mt-16">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2"></div>
        {steps.map((_, index) => (
          <div
            key={index}
            className="absolute top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-y-1/2"
            style={{ left: `${(index + 0.5) * 25}%` }}
          ></div>
        ))}
      </div>
    </section>
  )
} 