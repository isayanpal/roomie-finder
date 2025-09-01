"use client";

import { FeatureCardProps } from "@/constants/interfaces";
import { motion } from "framer-motion";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 text-center border border-[#ebd98d]/30 hover:border-[#d2b53b]/50 transition-all duration-300 shadow-lg hover:shadow-xl h-full flex flex-col">
        <motion.div
          className="w-16 h-16 bg-[#ebd060] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#d2b53b] transition-colors duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold mb-4 text-[#100e06]">{title}</h3>

        <p className="text-[#100e06]/70 leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
