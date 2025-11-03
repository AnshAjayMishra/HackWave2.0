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
      { name: "Features", href: "" },
      { name: "Contact Us", href: "/contactus" },
      { name: "About Us", href: "/about" },
      { name: "Home", href: "/" },
     
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
    <footer className="relative mt-16">
      {/* Distinctive Top Border with Teal Theme */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-300/30 to-transparent"></div>
      
      {/* Main Footer with Enhanced Background */}
      <div className="bg-gradient-to-br from-slate-900/95 via-teal-900/90 to-cyan-900/95 border-t-4 border-teal-500/30 backdrop-blur-sm">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/10 to-emerald-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">Janvaani</span>
              </div>
              <p className="text-slate-300/90 mb-6 max-w-md leading-relaxed">
                Transforming municipal services through voice-based AI technology. Making government services accessible, efficient, and citizen-friendly.
              </p>
              
              {/* Enhanced Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-teal-200/80">
                  <Globe className="w-4 h-4 text-teal-300" />
                  <span>Multi-Language</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-200/80">
                  <Shield className="w-4 h-4 text-teal-300" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-200/80">
                  <Users className="w-4 h-4 text-teal-300" />
                  <span>Accessibility First</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-200/80">
                  <FileText className="w-4 h-4 text-teal-300" />
                  <span>Document Ready</span>
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <Link href="/register">
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/40">
                  Get Started Free
                </Button>
              </Link>
              <span className="text-xl font-bold text-foreground">JanVaani</span>
            </div>

            {/* Enhanced Footer Links with Teal Theme */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-300/80 hover:text-teal-300 transition-colors duration-200 hover:pl-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Solutions</h3>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-300/80 hover:text-teal-300 transition-colors duration-200 hover:pl-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-300/80 hover:text-teal-300 transition-colors duration-200 hover:pl-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="pt-8 border-t border-teal-500/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright with Enhanced Styling */}
              <div className="text-sm text-slate-300/70">
                © 2024 Janvaani. All rights reserved.
              </div>

              {/* Enhanced Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 bg-teal-500/20 border border-teal-400/30 rounded-full flex items-center justify-center text-teal-300 hover:text-white hover:bg-teal-500/40 hover:border-teal-300/50 transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Enhanced Additional Info */}
            <div className="mt-6 pt-6 border-t border-teal-500/20">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-300/60">
                <Link href="#privacy" className="hover:text-teal-300 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="#terms" className="hover:text-teal-300 transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="#cookies" className="hover:text-teal-300 transition-colors duration-200">
                  Cookie Policy
                </Link>
                <Link href="#accessibility" className="hover:text-teal-300 transition-colors duration-200">
                  Accessibility
                </Link>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                  <span className="text-green-300/90">GDPR Compliant</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}