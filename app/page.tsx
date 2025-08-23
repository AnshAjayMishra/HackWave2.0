import { Header } from "@/components/header"
import  HeroSection  from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import  {BenefitsSection }  from "@/components/benefits-section"
import { CTASection } from "@/components/cta-section"
import { FooterSection } from "@/components/footer-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <Header />
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
          <CTASection />
        </div>
        
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 mt-16">
          <FooterSection />
        </div>
      </div>
    </div>
  )
}
