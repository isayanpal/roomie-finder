"use client"

import { motion } from "framer-motion"
import { ClipboardCheck, Search, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: ClipboardCheck,
    title: "Create Your Profile",
    description: "Set up your profile with your preferences, lifestyle, and what you're looking for in a roommate.",
  },
  {
    icon: Search,
    title: "Browse Matches",
    description: "Our algorithm finds potential roommates who match your criteria and lifestyle preferences.",
  },
  {
    icon: MessageSquare,
    title: "Connect & Decide",
    description: "Chat with your matches in real-time and find the perfect person to share your space with.",
  },
]

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        How It Works
      </motion.h2>

      <motion.p
        className="text-center text-[#100e06]/70 max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Finding your ideal roommate is easy with our simple three-step process
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <motion.div key={index} className="flex-1 relative" variants={itemVariants}>
            <div className="bg-[#ebd98d]/20 rounded-2xl p-8 text-center h-full border border-[#ebd98d]/30">
              <div className="w-16 h-16 bg-[#d2b53b] rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-[#100e06]/70">{step.description}</p>
            </div>

            {index < steps.length - 1 && (
              <motion.div
                className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-[#d2b53b]"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                →
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
