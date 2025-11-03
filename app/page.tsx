"use client"

import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/header"
import {HeroSection} from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BenefitsSection } from "@/components/benefits-section"
import { FooterSection } from "@/components/footer-section"

export default function LandingPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  // REMOVED: Automatic redirect logic
  // The landing page should NEVER automatically redirect users
  // Users should only be redirected when they explicitly take actions
  // like clicking login/register buttons or completing OTP verification

  // Show loading state only while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
     <div className="min-h-screen bg-background relative overflow-hidden pb-0">
     
      <div className="relative z-10">
        <main className="max-w-[1320px] mx-auto relative">
          <HeroSection />
        </main>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 mt-16">
          <FeaturesSection />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 mt-16">
          <HowItWorksSection />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 mt-16">
          <BenefitsSection />
        </div>
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 mt-16">
          <FooterSection />
        </div>
      </div>
    </div>
  )
}
