"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Users, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface User {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

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
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#d2b53b] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#100e06]">Loading chat history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-[#100e06] mb-2">
            Authentication Required
          </h3>
          <p className="text-[#100e06]/70 mb-6">
            You must be logged in to view your chat history.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />

      <div className="container mx-auto px-6 py-8 relative">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/match"
            className="inline-flex items-center gap-2 text-[#100e06]/70 hover:text-[#100e06] transition-colors mb-6 group"
          >
            <Button className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl px-4 py-2 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Matches
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#100e06] mb-2 flex items-center justify-center gap-3">
              <MessageCircle className="w-8 h-8 text-[#d2b53b]" />
              Chat <span className="text-[#d2b53b]">History</span>
            </h1>
            <p className="text-[#100e06]/70">Your recent conversations</p>
          </div>
        </div>

        {/* Chat List */}
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-[#ebd98d]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-[#d2b53b]" />
              </div>
              <h3 className="text-xl font-semibold text-[#100e06] mb-2">
                No Conversations Yet
              </h3>
              <p className="text-[#100e06]/70 mb-6">
                Start chatting with your matches to see your conversation
                history here.
              </p>
              <Link
                href="/match"
                className="inline-flex items-center justify-center bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Find Matches
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Stats Bar */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-[#ebd98d]/30 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d2b53b] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#100e06]">
                    {users.length} Active{" "}
                    {users.length === 1 ? "Conversation" : "Conversations"}
                  </p>
                  <p className="text-sm text-[#100e06]/70">
                    Click on any chat to continue the conversation
                  </p>
                </div>
              </div>
            </div>

            {/* Chat List */}
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/chat/${user.id}`)}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#ebd98d]/30 hover:border-[#d2b53b]/50 cursor-pointer transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={
                          user.image || "/placeholder.svg?height=60&width=60"
                        }
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#100e06] group-hover:text-[#d2b53b] transition-colors truncate">
                          {user.name}
                        </h3>
                        {user.lastMessageTime && (
                          <div className="flex items-center gap-1 text-xs text-[#100e06]/50">
                            <Clock className="w-3 h-3" />
                            {user.lastMessageTime}
                          </div>
                        )}
                      </div>
                      {user.lastMessage && (
                        <p className="text-sm text-[#100e06]/70 truncate">
                          {user.lastMessage}
                        </p>
                      )}
                      {!user.lastMessage && (
                        <p className="text-sm text-[#100e06]/50 italic">
                          Continue conversation...
                        </p>
                      )}
                    </div>

                    {/* Arrow Indicator */}
                    <div className="text-[#d2b53b] group-hover:translate-x-1 transition-transform">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-8">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-[#ebd98d]/30">
                <h3 className="text-lg font-semibold text-[#100e06] mb-2">
                  Want to meet more people?
                </h3>
                <p className="text-[#100e06]/70 mb-4">
                  Discover more potential roommates and start new conversations.
                </p>
                <Link
                  href="/match"
                  className="inline-flex items-center justify-center bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Find More Matches
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
