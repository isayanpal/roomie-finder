"use client";

import { User } from "@/constants/interfaces";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ChatHistory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchChats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);
      const res = await fetch("/api/chatHistory");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-md rounded-[2rem] p-10 shadow-xl border border-[#ebd98d]/30"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#d2b53b]/30 border-t-[#d2b53b] rounded-full animate-spin" />
            </div>
            <span className="text-[#100e06] font-medium tracking-wide">
              Loading conversations...
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 shadow-xl border border-red-200/50 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#100e06] mb-2">
            Authentication Required
          </h3>
          <p className="text-[#100e06]/70 mb-8 leading-relaxed">
            You must be logged in to view your chat history.
          </p>
          <Link href="/auth">
            <Button className="w-full bg-gradient-to-r from-[#d2b53b] to-[#ebd060] hover:opacity-90 text-white py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Go to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] relative w-screen left-[calc(-50vw+50%)] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 -left-10 w-64 h-64 bg-[#ebd98d]/20 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-[#ebd060]/15 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d2b53b]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/match">
              <Button
                variant="ghost"
                className="text-[#100e06]/70 hover:text-[#100e06] hover:bg-[#d2b53b]/10 rounded-full pl-2 pr-4 gap-2 transition-all"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium">Back</span>
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-5xl font-bold text-[#100e06] flex items-center justify-center gap-3 tracking-tight"
            >
              Chats
              <span className="relative">
                <span className="relative z-10 text-[#d2b53b]">History</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#ebd98d]/30 -rotate-2 z-0 rounded-full" />
              </span>
            </motion.h1>
            <p className="text-[#100e06]/60 font-medium">
              Your recent conversations and connections
            </p>
          </div>
        </motion.div>

        {/* Chat List */}
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-white/50 max-w-md w-full text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-28 h-28 bg-gradient-to-tr from-[#d2b53b]/20 to-[#ebd060]/20 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-14 h-14 text-[#d2b53b]" />
              </div>

              <h3 className="text-2xl font-bold text-[#100e06] mb-3 relative z-10">
                No Conversations Yet
              </h3>
              <p className="text-[#100e06]/60 mb-8 max-w-xs mx-auto leading-relaxed relative z-10">
                Looks like you haven't started chatting yet. Find your perfect
                roomie to get started!
              </p>

              <Link href="/match" className="relative z-10 block">
                <Button className="w-full bg-gradient-to-r from-[#d2b53b] to-[#ebd060] hover:opacity-90 text-white rounded-xl py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Find Matches
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Chat List */}
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/chat/${user.id}`)}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-xl border border-white/50 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d2b53b]/0 via-[#d2b53b]/5 to-[#d2b53b]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="flex items-center gap-5 relative z-10">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#d2b53b] to-[#ebd060] shadow-md">
                        <img
                          src={
                            user.image || "/placeholder.svg?height=60&width=60"
                          }
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white bg-white"
                        />
                      </div>
                      {/* Online Status Dot (Simulated) */}
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#d2b53b] border-2 border-white rounded-full" />
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-lg font-bold text-[#100e06] group-hover:text-[#d2b53b] transition-colors truncate">
                          {user.name}
                        </h3>
                        {user.lastMessageTime && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[#100e06]/40 bg-[#d2b53b]/10 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {user.lastMessageTime}
                          </div>
                        )}
                      </div>

                      {user.lastMessage ? (
                        <p className="text-sm text-[#100e06]/70 truncate font-medium group-hover:text-[#100e06]/90 transition-colors">
                          {user.lastMessage}
                        </p>
                      ) : (
                        <p className="text-sm text-[#d2b53b] italic font-medium flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          Start the conversation
                        </p>
                      )}
                    </div>

                    {/* Arrow Indicator */}
                    <div className="text-[#d2b53b]/30 group-hover:text-[#d2b53b] group-hover:translate-x-1 transition-all">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-12"
            >
              <div
                className="inline-block relative group cursor-pointer"
                onClick={() => router.push("/match")}
              >
                <div className="absolute inset-0 bg-[#d2b53b]/20 blur-xl rounded-full group-hover:bg-[#d2b53b]/30 transition-colors" />
                <div className="relative bg-white/50 backdrop-blur-sm rounded-full px-8 py-3 border border-[#d2b53b]/20 text-[#100e06]/80 font-medium group-hover:text-[#d2b53b] transition-colors shadow-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Discover more roommates
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
