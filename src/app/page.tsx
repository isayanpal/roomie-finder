"use client";

import AnimatedHero from "@/components/landingpage/animated-hero";
import FeatureCard from "@/components/landingpage/feature-card";
import FloatingElements from "@/components/landingpage/floating-elements";
import HowItWorks from "@/components/landingpage/how-it-works";
import { Button } from "@/components/ui/button";
import { features } from "@/constants/constants";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
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
    <div className="min-h-screen text-[#100e06] overflow-hidden relative w-screen left-[calc(-50vw+50%)]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ebd98d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#d2b53b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-[#ebd060] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <AnimatedHero />

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="my-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Why Choose Roomie Finder?
            </h2>
            <p className="text-lg text-[#100e06]/60 max-w-2xl mx-auto">
              We've reimagined the roommate hunting experience to be safe,
              simple, and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <div className="my-32">
          <HowItWorks />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-32 max-w-5xl mx-auto relative"
        >
          {/* Decorative background element for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#ebd98d]/10 via-[#d2b53b]/5 to-[#ebd98d]/10 rounded-full blur-3xl -z-10 opacity-60"></div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none text-[#100e06]">
            Ready to find your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2b53b] to-[#bfa32a]">
              perfect match?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[#100e06]/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of happy users who found their ideal living situation
            through Roomie Finder.
          </p>
          <Link href={loggedInUser ? "/preferences" : "/auth"}>
            <Button
              size="lg"
              className="bg-[#100e06] hover:bg-[#2a2a2a] text-white px-12 py-8 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#d2b53b]/20"
            >
              Get Started Now
            </Button>
          </Link>
        </motion.div>

        {/* Floating Elements */}
        <FloatingElements />
      </div>
    </div>
  );
}
