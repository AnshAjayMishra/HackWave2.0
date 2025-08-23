"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Mic, 
  Globe, 
  Shield, 
  Smartphone, 
  Clock, 
  Users, 
  FileText, 
  Bell,
  MapPin,
  Phone
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "Voice-First Interface",
      description: "Natural voice conversations in multiple languages with advanced speech recognition",
      badge: "Core Feature",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Available in local languages to serve diverse communities effectively",
      badge: "Inclusive",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with data encryption and privacy protection",
      badge: "Secure",
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Works seamlessly on smartphones, tablets, and desktop devices",
      badge: "Responsive",
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock access to municipal services and information",
      badge: "Always On",
      color: "from-yellow-500/20 to-amber-500/20"
    },
    {
      icon: Users,
      title: "Accessibility First",
      description: "Designed for users with disabilities and limited digital literacy",
      badge: "Accessible",
      color: "from-pink-500/20 to-rose-500/20"
    },
    {
      icon: FileText,
      title: "Document Processing",
      description: "Submit forms, upload documents, and track application status",
      badge: "Efficient",
      color: "from-teal-500/20 to-cyan-500/20"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get updates on service requests, deadlines, and important announcements",
      badge: "Proactive",
      color: "from-indigo-500/20 to-blue-500/20"
    },
    {
      icon: MapPin,
      title: "Location Services",
      description: "Find nearby facilities, report local issues, and get area-specific information",
      badge: "Local",
      color: "from-emerald-500/20 to-green-500/20"
    },
    {
      icon: Phone,
      title: "Seamless Integration",
      description: "Integrates with existing municipal systems and databases",
      badge: "Connected",
      color: "from-violet-500/20 to-purple-500/20"
    }
  ]

  return (
    <section id="features-section" className="py-20">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground">
          ✨ Powerful Features
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Everything You Need for
          <span className="text-primary block">Smart Municipal Services</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our AI assistant provides comprehensive features to transform how citizens interact with local government services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                {feature.description}
              </CardDescription>
              
              {/* Feature Visual */}
              <div className={`relative w-full h-32 bg-gradient-to-br ${feature.color} rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 