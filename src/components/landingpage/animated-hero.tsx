"use client"

import { motion } from "framer-motion"
import { Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AnimatedHero() {
    const [loggedInUser, setLoggedInUser] = useState<any | null>(null)
  
    useEffect(() => {
      const getUser = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setLoggedInUser(user)
      }
      getUser()
    }, [])

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
    <motion.div className="text-center mb-20 cursor-default" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <motion.div
          className="inline-flex items-center gap-2 bg-[#ebd98d] px-4 py-2 rounded-full text-sm font-medium mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Search className="w-4 h-4" />
          Find Your Perfect Roommate
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Roomie <br />
          <motion.span
            className="text-[#d2b53b] text-5xl md:text-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Finder
          </motion.span>
        </motion.h1>

        <motion.p className="text-xl md:text-2xl text-[#100e06]/70 max-w-2xl mx-auto mb-8" variants={itemVariants}>
          Connect with like-minded people and find your ideal living situation with ease.
        </motion.p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href={loggedInUser ? "/preferences" : "/auth"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              size="lg"
              className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg"
            >
              Get Started
              <Zap className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
