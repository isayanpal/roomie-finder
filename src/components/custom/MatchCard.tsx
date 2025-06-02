"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from "recharts"
import { motion } from "framer-motion"
import { MapPin, Briefcase, User, MessageCircle, Heart } from "lucide-react"

interface MatchCardProps {
  userId: string
  userImage: string
  userName: string
  matchPercent: number
  location: string
  gender: string
  occupation: string
}

export const MatchCard: React.FC<MatchCardProps> = ({
  userId,
  userImage,
  userName,
  matchPercent,
  location,
  gender,
  occupation,
}) => {
  const chartData = [{ name: "match", value: matchPercent ?? 0, fill: "#d2b53b" }]

  const getMatchColor = (percent: number) => {
    return "text-[#100e06]"
  }

  const getMatchGradient = (percent: number) => {
    return "from-[#d2b53b] to-[#ebd060]"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-[280px] sm:max-w-[300px] mx-auto"
    >
      <Card className="overflow-hidden border border-[#ebd98d]/30 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-3xl relative h-full hover:border-[#d2b53b]/50">
        {/* Floating background elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-[#ebd98d]/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#ebd060]/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="flex flex-col h-full">
          <div className="relative h-24 flex items-center justify-center pt-4 pb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10 -mb-12"
            >
              <img
                src={userImage || "/placeholder.svg"}
                alt={userName}
                className="rounded-full w-24 h-24 object-cover shadow-lg ring-4 ring-white border border-[#ebd98d]/30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-1 -right-1 bg-[#d2b53b] rounded-full p-1.5 shadow-lg"
              >
                <Heart className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </motion.div>
            </motion.div>
          </div>

          <CardHeader className="pt-10 px-4 text-center flex-grow-0">
            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-[#100e06] group-hover:text-[#100e06]/80 transition-colors truncate"
            >
              {userName}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center"
            >
              <RadialBarChart
                width={80}
                height={80}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={38}
                barSize={7}
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarGrid radialLines={false} stroke="none" />
                <RadialBar background={{ fill: "#ebd98d30" }} dataKey="value" cornerRadius={10} fill="#d2b53b" />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={(props) => {
                      const viewBox = props?.viewBox as any
                      const cx = typeof viewBox?.cx === "number" ? viewBox.cx : 40
                      const cy = typeof viewBox?.cy === "number" ? viewBox.cy : 40

                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={cx}
                            y={cy - 3}
                            className={`${getMatchColor(matchPercent)} text-base font-bold fill-current`}
                          >
                            {`${matchPercent ?? 0}%`}
                          </tspan>
                          <tspan x={cx} y={cy + 10} className="fill-[#100e06]/60 text-xs font-medium">
                            Match
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </motion.div>
          </CardHeader>

          <CardContent className="px-4 py-2 space-y-2 text-center text-[#100e06]/70 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-1.5 text-sm w-full"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d2b53b] flex-shrink-0" />
              <span className="font-medium truncate">{location}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-1.5 text-sm w-full"
            >
              <User className="w-3.5 h-3.5 text-[#d2b53b] flex-shrink-0" />
              <span className="font-medium truncate capitalize">{gender}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1.5 text-sm w-full"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#d2b53b] flex-shrink-0" />
              <span className="font-medium truncate">{occupation}</span>
            </motion.div>
          </CardContent>

          <CardFooter className="p-4 pt-3 flex-grow-0">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <Link href={`/chat/${userId}`} className="w-full">
                <Button
                  className={`w-full bg-gradient-to-r ${getMatchGradient(
                    matchPercent,
                  )} hover:opacity-90 active:scale-[0.98] transition-all duration-300 text-white font-medium py-2 text-sm rounded-xl shadow-lg hover:shadow-xl border-0`}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Start Chat
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}
