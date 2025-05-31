"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import NotificationBell from "./NotificationBell";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any | null>(null); // Replace 'any' with your User type if available

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      setUser(session?.user || null);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during sign out:", error.message);
    } else {
      setUser(null); // Immediately reflect UI update
      toast.success("Logged Out!")
      router.push("/auth"); // Redirect to auth page
    }
  };

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow">
      <div>Roomie Finder</div>
      {user ? (
        <>
          <div className="space-x-4">
            <Link href="/preferences" className="text-gray-600 hover:text-gray-900">
              Preferences
            </Link>
            <Link href="/match" className="text-gray-600 hover:text-gray-900">
              Match
            </Link>
            <Link href="/chat/history" className="text-gray-600 hover:text-gray-900">
              Chat History
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Button onClick={handleLogout} variant={"destructive"}>
              Logout
            </Button>
          </div>
        </>
      ) : (
        <Link href="/auth">
          <Button>Sign In</Button>
        </Link>
      )}
    </nav>
  );
}
