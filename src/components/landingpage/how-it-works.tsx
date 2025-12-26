"use client";

import { steps } from "@/constants/constants";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-24 relative">
      {/* Decorative dashed line connecting steps on larger screens */}
      <div className="hidden md:block absolute top-[60%] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#d2b53b]/30 to-transparent z-0 border-t-2 border-dashed border-[#d2b53b]/20"></div>

      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#100e06]">
          Simplicity at its Best
        </h2>
        <p className="text-xl text-[#100e06]/60 max-w-2xl mx-auto font-light leading-relaxed">
          Three simple steps to finding your ideal living situation. No stress,
          no hassle.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center group"
            variants={itemVariants}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#d2b53b]/20 blur-2xl rounded-full group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#ffffff] to-[#f7f7f7] rounded-full flex items-center justify-center border-2 border-[#ebd98d]/50 shadow-lg group-hover:scale-110 transition-transform duration-500 z-10">
                <step.icon className="w-10 h-10 text-[#d2b53b] fill-current/10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#d2b53b] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {index + 1}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-[#100e06] group-hover:text-[#d2b53b] transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-[#100e06]/70 leading-relaxed max-w-sm">
              {step.description}
            </p>

            {index < steps.length - 1 && (
              <div className="md:hidden mt-8 text-[#d2b53b]/50">
                <ArrowRight className="w-6 h-6 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
