"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Mic, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Shield, 
  Users,
  FileText
} from "lucide-react"
import Link from "next/link"

export function FooterSection() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features-section" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Benefits", href: "#benefits" },
      { name: "Security", href: "#security" },
      { name: "Pricing", href: "#pricing" }
    ],
    solutions: [
      { name: "Citizen Services", href: "#citizen-services" },
      { name: "Government Agencies", href: "#government" },
      { name: "Municipal Operations", href: "#operations" },
      { name: "Emergency Services", href: "#emergency" },
      { name: "Public Works", href: "#public-works" }
    ],
    support: [
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#api" },
      { name: "Help Center", href: "#help" },
      { name: "Contact Support", href: "#contact" },
      { name: "Training", href: "#training" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Partners", href: "#partners" },
      { name: "Blog", href: "#blog" }
    ]
  }

  const socialLinks = [
    { name: "Twitter", href: "#", icon: "𝕏" },
    { name: "LinkedIn", href: "#", icon: "in" },
    { name: "GitHub", href: "#", icon: "⌥" },
    { name: "YouTube", href: "#", icon: "▶" }
  ]

  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Janvaani</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transforming municipal services through voice-based AI technology. Making government services accessible, efficient, and citizen-friendly.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                <span>Multi-Language</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Accessibility First</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 text-primary" />
                <span>Document Ready</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2024 Janvaani. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <Link href="#privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link href="#accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
