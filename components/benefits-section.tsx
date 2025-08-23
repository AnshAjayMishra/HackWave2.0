"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  Globe,
  Smartphone,
  BarChart3
} from "lucide-react"

export function BenefitsSection() {
  const citizenBenefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No more waiting in lines or navigating complex websites. Get services instantly through voice commands.",
      metric: "90% faster"
    },
    {
      icon: Smartphone,
      title: "Easy Access",
      description: "Access municipal services from anywhere, anytime, using just your voice on any device.",
      metric: "24/7 availability"
    },
    {
      icon: Globe,
      title: "Language Support",
      description: "Get services in your preferred language, breaking down communication barriers.",
      metric: "15+ languages"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      metric: "100% secure"
    }
  ]

  const governmentBenefits = [
    {
      icon: TrendingUp,
      title: "Increased Efficiency",
      description: "Automate routine inquiries and reduce manual processing, allowing staff to focus on complex cases.",
      metric: "60% efficiency gain"
    },
    {
      icon: DollarSign,
      title: "Cost Reduction",
      description: "Lower operational costs through automation and reduced need for physical service centers.",
      metric: "40% cost savings"
    },
    {
      icon: Users,
      title: "Better Citizen Satisfaction",
      description: "Provide faster, more accessible services that improve citizen experience and trust.",
      metric: "85% satisfaction"
    },
    {
      icon: BarChart3,
      title: "Data Insights",
      description: "Gain valuable insights into citizen needs and service usage patterns for better planning.",
      metric: "Real-time analytics"
    }
  ]

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground">
          🎯 Key Benefits
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Benefits for
          <span className="text-primary block">Everyone</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our AI assistant creates value for both citizens and government agencies, making municipal services more efficient and accessible.
        </p>
      </div>

      {/* Visual Divider */}
      <div className="flex justify-center mb-16">
        <div className="relative">
          <div className="w-64 h-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-full flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Citizens</span>
              <div className="w-1 h-6 bg-primary/30 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Government</span>
              <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Benefits */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            For Citizens
          </h3>
          <p className="text-lg text-muted-foreground">
            Experience municipal services like never before with our voice-first approach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {citizenBenefits.map((benefit, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {benefit.description}
                </CardDescription>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {benefit.metric}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Government Benefits */}
      <div>
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            For Government Agencies
          </h3>
          <p className="text-lg text-muted-foreground">
            Transform your operations and deliver better services to your community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {governmentBenefits.map((benefit, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {benefit.description}
                </CardDescription>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {benefit.metric}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 