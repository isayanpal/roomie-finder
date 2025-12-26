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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
    >
      <div className="relative bg-white/40 backdrop-blur-md rounded-[2rem] p-10 text-center border border-white/50 hover:border-[#d2b53b]/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d2b53b]/10 h-full flex flex-col overflow-hidden">
        {/* Hover Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ebd98d]/0 to-[#d2b53b]/0 group-hover:from-[#ebd98d]/10 group-hover:to-[#d2b53b]/5 transition-all duration-500"></div>

        <motion.div
          className="relative w-20 h-20 bg-gradient-to-br from-[#ebd060] to-[#d2b53b] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Icon className="w-10 h-10 text-white drop-shadow-md" />
        </motion.div>

        <h3 className="relative text-2xl font-bold mb-4 text-[#100e06] group-hover:text-[#d2b53b] transition-colors duration-300">
          {title}
        </h3>

        <p className="relative text-[#100e06]/70 leading-relaxed flex-grow font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
