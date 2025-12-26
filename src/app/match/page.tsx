"use client";

import { MatchCard } from "@/components/custom/MatchCard";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

export default function MatchPage() {
  const supabase = createClient();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Please log in to see matches. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/auth";
          }, 2000);
          setLoading(false);
          return;
        }

        const prefRes = await fetch("/api/preferences");
        if (!prefRes.ok) {
          // If 404, maybe user hasn't set preferences?
          if (prefRes.status === 404) {
            // Handle gracefully if needed
          }
          throw new Error(
            `Failed to fetch preferences: ${prefRes.status} ${prefRes.statusText}`
          );
        }
        const pref = await prefRes.json();

        const matchesRes = await fetch("/api/matches");
        if (!matchesRes.ok) {
          throw new Error(
            `Failed to fetch matches: ${matchesRes.status} ${matchesRes.statusText}`
          );
        }
        const others = await matchesRes.json();

        if (!Array.isArray(others)) {
          throw new Error("API /api/matches did not return an array.");
        }
        if (typeof pref.preferences !== "object" || pref.preferences === null) {
          throw new Error(
            "API /api/preferences did not return a valid preferences object."
          );
        }

        const score = (a: any, b: any) => {
          const keys = Object.keys(a);
          if (keys.length === 0) return 0;
          let c = 0;
          keys.forEach((k) => {
            if (a[k] === b[k]) c++;
          });
          return Math.round((c / keys.length) * 100);
        };

        setMatches(
          others.map((o: any) => ({
            ...o,
            matchPercent: score(pref.preferences, o.preferences),
          }))
        );
      } catch (err: any) {
        setError(
          err.message || "An unknown error occurred while fetching matches."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch users: ${response.status} ${response.statusText}`
          );
        }

        const users = await response.json();
        const count = users.length;
        setTotalNumberOfUsers(count);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error in fetching other users");
      }
    };

    fetchUsers();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  // Pagination Logic
  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const currentMatches = matches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#fbf9f1] relative font-sans selection:bg-[#d2b53b]/30">
      {/* Background Ambience - More subtle and layered */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#ebd98d]/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d2b53b]/5 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#ebd060]/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 relative z-10">
        {/* Navbar / Header Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="group p-0 hover:bg-transparent text-[#100e06]/60 hover:text-[#100e06] transition-all flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white/50 border border-[#d2b53b]/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium text-lg">Back</span>
              </Button>
            </Link>
          </div>

          <div className="text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold text-[#100e06] tracking-tight mb-2">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2b53b] to-[#bfa335]">
                Matches
              </span>
            </h1>
            <p className="text-[#100e06]/60 font-medium">
              Find your perfect roommate harmony
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-24 min-h-[50vh]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#d2b53b]/20 blur-xl rounded-full animate-pulse" />
                <div className="w-20 h-20 bg-gradient-to-br from-[#d2b53b] to-[#ebd060] rounded-3xl flex items-center justify-center shadow-xl relative z-10 animate-spin-slow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#100e06] mt-8 mb-2">
                Curating Connections
              </h3>
              <p className="text-[#100e06]/60 animate-pulse">
                Analyzing compatibility scores...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-10 shadow-2xl border border-red-100 max-w-lg w-full text-center hover:scale-[1.01] transition-transform duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Heart className="w-10 h-10 text-red-500 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-[#100e06] mb-3">
                  Connection Interrupted
                </h3>
                <p className="text-[#100e06]/70 mb-8 leading-relaxed">
                  {error}
                </p>
                <Button
                  onClick={handleRetry}
                  className="bg-[#100e06] hover:bg-[#2a271d] text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <RefreshCw className="w-5 h-5 mr-3" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {/* No Matches State */}
          {!loading && !error && matches.length === 0 && (
            <motion.div
              key="no-matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center py-24"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 max-w-xl w-full text-center">
                <div className="w-24 h-24 bg-[#ebd98d]/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-[#d2b53b]/10 blur-xl rounded-full" />
                  <Users className="w-10 h-10 text-[#d2b53b]" />
                </div>
                <h3 className="text-3xl font-bold text-[#100e06] mb-4">
                  Quiet on this front
                </h3>
                <p className="text-[#100e06]/60 mb-10 text-lg leading-relaxed">
                  We couldn't find exact matches for your current preferences.
                  Tweaking your criteria often reveals hidden gems!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/preferences">
                    <Button className="bg-[#d2b53b] hover:bg-[#c4a935] text-white rounded-xl px-8 py-6 text-lg font-medium shadow-lg hover:shadow-[#d2b53b]/30 transition-all w-full sm:w-auto">
                      <Settings className="w-5 h-5 mr-2" />
                      Update Preferences
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="border-2 border-[#eeeadd] text-[#100e06] hover:bg-[#fbf9f1] rounded-xl px-8 py-6 text-lg font-medium w-full sm:w-auto"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Matches Grid & Content */}
          {!loading && !error && matches.length > 0 && (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Stats Overview - Sleek Glass Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <motion.div
                  variants={itemVariants}
                  className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d2b53b]/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-[#d2b53b] group-hover:text-white transition-colors duration-300">
                      <Users className="w-6 h-6" />
                    </div>
                    {totalNumberOfUsers > 0 && (
                      <span className="flex items-center text-xs font-bold text-[#d2b53b] bg-[#d2b53b]/10 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" />+
                        {Math.round(totalNumberOfUsers * 0.55)}%
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#100e06] mb-1 tracking-tight">
                      <NumberTicker value={totalNumberOfUsers} />
                    </div>
                    <p className="text-[#100e06]/60 font-medium text-sm uppercase tracking-wider">
                      Community Members
                    </p>
                  </div>
                </motion.div>

                {/* Stat Card 2 */}
                <motion.div
                  variants={itemVariants}
                  className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ebd060]/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-[#ebd060] group-hover:text-white transition-colors duration-300">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#ebd060] animate-pulse shadow-[0_0_10px_#ebd060]" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#100e06] mb-1 tracking-tight">
                      <NumberTicker value={matches.length} />
                    </div>
                    <p className="text-[#100e06]/60 font-medium text-sm uppercase tracking-wider">
                      Active Matches
                    </p>
                  </div>
                </motion.div>

                {/* Stat Card 3 */}
                <motion.div
                  variants={itemVariants}
                  className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d2b53b]/10 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-[#d2b53b] group-hover:text-white transition-colors duration-300">
                        <Settings className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[#100e06]/90 font-semibold mb-3 text-lg leading-tight">
                        Refine your criteria for better results
                      </p>
                      <Link href="/preferences" className="block">
                        <Button className="w-full bg-[#d2b53b] hover:bg-[#c4a935] text-white border-none rounded-xl h-11 shadow-lg hover:shadow-[#d2b53b]/40 transition-all">
                          Edit Preferences
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Matches List */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-bold text-[#100e06]">
                    Top Picks for You
                  </h2>
                  <span className="text-sm font-medium text-[#100e06]/50">
                    Showing {currentMatches.length} of {matches.length}
                  </span>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto"
                >
                  <AnimatePresence mode="popLayout">
                    {currentMatches.map((m) => (
                      <motion.div
                        layout
                        key={m.userId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MatchCard
                          userId={m.userId}
                          userImage={m.userImage}
                          userName={m.userName}
                          matchPercent={m.matchPercent}
                          location={m.location}
                          gender={m.gender}
                          occupation={m.occupation}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mt-12 mb-8"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-white hover:bg-[#f0eadd] border-none shadow-sm rounded-full w-12 h-12 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#100e06]" />
                    </Button>

                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/50 shadow-sm">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                        ${
                                          currentPage === page
                                            ? "bg-[#d2b53b] text-white shadow-lg shadow-[#d2b53b]/30 scale-110"
                                            : "text-[#100e06]/60 hover:bg-[#ebd98d]/20 hover:text-[#100e06]"
                                        }
                                    `}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-white hover:bg-[#f0eadd] border-none shadow-sm rounded-full w-12 h-12 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 text-[#100e06]" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
