"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MatchPage() {
  const supabase = createClient();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null); // Add an error state

  useEffect(() => {
    (async () => {
      setLoading(true); // Ensure loading is true at the start of every effect run
      setError(null); // Clear previous errors

      try {
        // Wrap the async operations in a try-catch block
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.error("MatchPage: User not authenticated.");
          setError("Please log in to see matches.");
          setLoading(false);
          return;
        }

        console.log("Fetching preferences...");
        const prefRes = await fetch("/api/preferences");
        if (!prefRes.ok)
          throw new Error(
            `Failed to fetch preferences: ${prefRes.status} ${prefRes.statusText}`
          );
        const pref = await prefRes.json();
        console.log("Preferences:", pref);

        console.log("Fetching matches...");
        const matchesRes = await fetch("/api/matches");
        if (!matchesRes.ok)
          throw new Error(
            `Failed to fetch matches: ${matchesRes.status} ${matchesRes.statusText}`
          );
        const others = await matchesRes.json();
        console.log("Other profiles:", others);

        // Check if 'others' is an array and 'pref.preferences' is an object
        if (!Array.isArray(others)) {
          throw new Error("API /api/matches did not return an array.");
        }
        if (typeof pref.preferences !== "object" || pref.preferences === null) {
          throw new Error(
            "API /api/preferences did not return a valid preferences object."
          );
        }

        // calculate score
        const score = (a: any, b: any) => {
          const keys = Object.keys(a);
          if (keys.length === 0) return 0; // Avoid division by zero
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
        console.log("Matches set successfully.");
      } catch (err: any) {
        console.error("MatchPage: Error during fetch:", err);
        setError(
          err.message || "An unknown error occurred while fetching matches."
        );
      } finally {
        setLoading(false); // Ensure loading is always set to false
      }
    })();
  }, []);

  if (loading) return <p>Loading matches…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>; // Display error message
  if (matches.length === 0) return <p>No matches found.</p>; // Handle empty matches
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <div>
        <Link href={"/"}>
          <Button>Back to Home</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <div
            key={m.userId}
            className="bg-white p-4 rounded shadow flex gap-4"
          >
            <img src={m.userImage} alt="" className="rounded-full w-32" />
            <div>
              <p className="font-semibold">{m.userName}</p>
              <p className="text-sm text-gray-600">Match: {m.matchPercent}%</p>
              <p className="text-sm text-gray-600">Location: {m.location}</p>
              <p className="text-sm text-gray-600">Gender: {m.gender}</p>
              <p className="text-sm text-gray-600">
                Occupation: {m.occupation}
              </p>
              <a
                href={`/chat/${m.userId}`}
                className="text-blue-600 underline text-sm mt-1 block"
              >
                Chat Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
