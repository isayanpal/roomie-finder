"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Settings, Search } from "lucide-react"
import AnimatedHero from "@/components/landingpage/animated-hero"
import FeatureCard from "@/components/landingpage/feature-card"
import FloatingElements from "@/components/landingpage/floating-elements"
import HowItWorks from "@/components/landingpage/how-it-works"
import { createClient } from "@/utils/supabase/client"

export default function Home() {
  const supabase = createClient()
  // const session = await supabase.auth.getSession();

  const features = [
    {
      icon: Settings,
      title: "Set Your Preferences",
      description:
        "Customize your living preferences, budget, and lifestyle choices to find the perfect match. Tell us what matters most to you in a roommate.",
    },
    {
      icon: Search,
      title: "Find Matching Profiles",
      description:
        "Discover compatible roommates based on your preferences and shared interests. Our smart algorithm ensures you only see relevant matches.",
    },
    {
      icon: MessageCircle,
      title: "Realtime Chat",
      description:
        "Connect instantly with potential roommates through our seamless chat feature. Get to know each other before deciding to meet in person.",
    },
  ]

  return (
    <div className="min-h-screen text-[#100e06] overflow-hidden relative">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <AnimatedHero />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* CTA Section */}
        <div className="text-center py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your perfect roommate?</h2>
          <p className="text-lg text-[#100e06]/70 mb-8">
            Join thousands of happy users who found their ideal living situation through Roomie Finder.
          </p>
          <Link href="/preferences">
            <Button
              size="lg"
              className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg"
            >
              Get Started Now
            </Button>
          </Link>
        </div>

        {/* Floating Elements */}
        <FloatingElements />
      </div>
    </div>
  )
}
