"use client";

import { MatchCard } from "@/components/custom/MatchCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Heart,
  RefreshCw,
  Settings,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function MatchPage() {
  const supabase = createClient();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleRetry = () => {
    window.location.reload();
  };

  const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(0);

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

        // console.log(`Total number of users: ${count}`);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error in fetching other users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf9f1] relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />

      <div className="container mx-auto px-6 py-8 relative">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#100e06]/70 hover:text-[#100e06] transition-colors mb-6 group"
          >
            <Button className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl px-4 py-2 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#100e06] mb-2 flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-[#d2b53b]" />
              Your <span className="text-[#d2b53b]">Matches</span>
            </h1>
            <p className="text-[#100e06]/70">
              Discover your perfect roommate connections
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-[#ebd060] rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-[#100e06] mb-2">
                Finding Your Perfect Matches
              </h3>
              <p className="text-[#100e06]/70">
                We're analyzing compatibility and preferences...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#100e06] mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-[#100e06]/70 mb-6">{error}</p>
              <Button
                onClick={handleRetry}
                className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Matches State */}
        {!loading && !error && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-[#ebd98d]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-[#d2b53b]" />
              </div>
              <h3 className="text-xl font-semibold text-[#100e06] mb-2">
                No Matches Found Yet
              </h3>
              <p className="text-[#100e06]/70 mb-6">
                Don't worry! Try updating your preferences or check back later
                for new potential roommates.
              </p>
              <div className="flex flex-col items-center justify-center sm:flex-row gap-3">
                <Link href="/preferences">
                  <Button className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Update Preferences
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="border-[#ebd98d] text-[#100e06] hover:bg-[#ebd98d]/20 rounded-xl flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && matches.length > 0 && totalNumberOfUsers > 0 && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-default">
              {/* Card 1: Total Users */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#fbf9f1] to-[#fbf9f1]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#ebd98d]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d2b53b]/5 to-[#ebd060]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d2b53b] to-[#ebd060] rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-[#fbf9f1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#100e06] mb-1">
                      <NumberTicker value={totalNumberOfUsers} />
                    </p>
                    <p className="text-sm font-medium text-[#100e06]/70">
                      {totalNumberOfUsers === 1 ? "User" : "Users"} Registered Other than you
                    </p>
                    <p className="text-xs text-[#100e06]/60 mt-2">
                      Growing community with new members every month
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ebd98d]/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <p className="text-xs font-medium text-[#d2b53b]">
                      +{Math.round(totalNumberOfUsers * 0.55)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Matches */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#fbf9f1] to-[#fbf9f1]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#ebd98d]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ebd060]/5 to-[#d2b53b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ebd060] to-[#d2b53b] rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-[#fbf9f1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#100e06] mb-1">
                      <NumberTicker value={matches.length} />
                    </p>
                    <p className="text-sm font-medium text-[#100e06]/70">
                      {matches.length === 1 ? "Match" : "Matches"} Found
                    </p>
                    <p className="text-xs text-[#100e06]/60 mt-2">
                      Might be your first potential
                      connection this week!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ebd060] animate-pulse" />
                    <p className="text-xs font-medium text-[#d2b53b]">Active</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Edit Preferences */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#fbf9f1] to-[#fbf9f1]/80 backdrop-blur-xl rounded-3xl p-6 border border-[#ebd98d]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ebd98d]/5 to-[#ebd060]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ebd98d] to-[#d2b53b] rounded-2xl flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-[#fbf9f1]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#100e06] mb-1">
                      Customize Your Experience
                    </p>
                    <p className="text-xs text-[#100e06]/60">
                      Update matching preferences
                    </p>
                  </div>
                  <Link href="/preferences" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#ebd98d] text-[#100e06] hover:bg-[#ebd98d]/10 hover:border-[#d2b53b] rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                    >
                      <Settings className="w-4 h-4"/>
                      Edit Preferences
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {matches.map((m) => (
                <MatchCard
                  key={m.userId}
                  userId={m.userId}
                  userImage={m.userImage}
                  userName={m.userName}
                  matchPercent={m.matchPercent}
                  location={m.location}
                  gender={m.gender}
                  occupation={m.occupation}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-8">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-[#ebd98d]/30 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-[#100e06] mb-2">
                  Want to see more matches?
                </h3>
                <p className="text-[#100e06]/70 mb-4">
                  Update your preferences to discover more compatible roommates
                  in your area.
                </p>
                <Link href="/preferences">
                  <Button className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl">
                    Refine My Preferences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
