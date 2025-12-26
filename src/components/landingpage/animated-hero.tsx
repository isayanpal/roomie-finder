"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Search, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnimatedHero() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="text-center mb-32 cursor-default relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium mb-8 text-[#100e06]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Search className="w-5 h-5 text-[#d2b53b]" />
          <span className="tracking-wide uppercase text-xs font-bold text-[#d2b53b]">
            Find Your Perfect Roommate
          </span>
        </motion.div>

        <motion.h1
          className="text-7xl md:text-9xl font-bold mb-8 leading-tight tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Roomie <br />
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2b53b] to-[#ebd060] inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            Finder
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-[#100e06]/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          variants={itemVariants}
        >
          Connect with like-minded people and find your ideal living situation
          with ease and confidence.
        </motion.p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
      >
        <Link href={loggedInUser ? "/preferences" : "/auth"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              size="lg"
              className="bg-[#d2b53b] hover:bg-[#c4a934] text-white px-10 py-7 text-xl font-semibold rounded-full shadow-[0_10px_40px_-10px_rgba(210,181,59,0.5)] transition-all duration-300"
            >
              Get Started
              <Zap className="ml-2 w-5 h-5 fill-current" />
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
