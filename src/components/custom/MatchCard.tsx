"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MatchCardProps } from "@/constants/interfaces";
import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import type React from "react";

export const MatchCard: React.FC<MatchCardProps> = ({
  userId,
  userImage,
  userName,
  matchPercent,
  location,
  gender,
  occupation,
}) => {
  const chartData = [
    { name: "match", value: matchPercent ?? 0, fill: "#d2b53b" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="w-full max-w-[280px] sm:max-w-[300px] mx-auto group perspective-1000"
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-md rounded-[2rem] relative h-full ring-1 ring-white/20 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#d2b53b]/10">
        {/* Sleek Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-50 z-0" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#d2b53b]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#ebd060]/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full pt-6">
          {/* Avatar Section with Integrated Match Badge */}
          <div className="relative mx-auto mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#d2b53b] to-[#ebd060] shadow-lg">
                <img
                  src={userImage || "/placeholder.svg"}
                  alt={userName}
                  className="rounded-full w-full h-full object-cover border-2 border-white/80 bg-white"
                />
              </div>

              {/* Floating Heart Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md text-[#d2b53b]"
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>

              {/* Floating Match Score Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -top-2 -right-4 bg-[#fff] text-[#100e06] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-[#d2b53b]/20 flex items-center gap-1"
              >
                <span className="text-[#d2b53b] text-xs">{matchPercent}%</span>{" "}
                Match
              </motion.div>
            </motion.div>
          </div>

          {/* User Info */}
          <CardContent className="px-5 pb-2 text-center space-y-3 flex-grow">
            <div>
              <h3 className="text-2xl font-bold text-[#100e06] tracking-tight mb-1">
                {userName}
              </h3>
              <p className="text-xs font-medium text-[#100e06]/50 uppercase tracking-widest letter-spacing-2">
                {occupation}
              </p>
            </div>

            {/* Tags / Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs font-medium text-[#100e06]/70">
              <div className="px-3 py-1.5 rounded-full bg-white/40 border border-white/30 backdrop-blur-sm flex items-center gap-1.5 shadow-sm hover:bg-white/60 transition-colors">
                <MapPin className="w-3 h-3 text-[#d2b53b]" />
                {location}
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/40 border border-white/30 backdrop-blur-sm flex items-center gap-1.5 shadow-sm hover:bg-white/60 transition-colors capitalize">
                <User className="w-3 h-3 text-[#d2b53b]" />
                {gender}
              </div>
            </div>
          </CardContent>

          {/* Action Button */}
          <CardFooter className="p-5 pt-2 mt-2">
            <Link href={`/chat/${userId}`} className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#d2b53b] to-[#ebd060] hover:opacity-90 active:scale-[0.98] transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] rounded-full py-6 font-semibold tracking-wide border-0">
                <MessageCircle className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};
