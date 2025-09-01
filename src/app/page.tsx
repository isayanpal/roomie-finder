"use client";

import AnimatedHero from "@/components/landingpage/animated-hero";
import FeatureCard from "@/components/landingpage/feature-card";
import FloatingElements from "@/components/landingpage/floating-elements";
import HowItWorks from "@/components/landingpage/how-it-works";
import { Button } from "@/components/ui/button";
import { features } from "@/constants/constants";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setLoggedInUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen text-[#100e06] overflow-hidden relative">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <AnimatedHero />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* CTA Section */}
        <div className="text-center py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your perfect roommate?
          </h2>
          <p className="text-lg text-[#100e06]/70 mb-8">
            Join thousands of happy users who found their ideal living situation
            through Roomie Finder.
          </p>
          <Link href={loggedInUser ? "/preferences" : "/auth"}>
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
  );
}
