"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileData } from "@/constants/interfaces";
import {
  ArrowLeft,
  Briefcase,
  Cigarette,
  Home,
  MapPin,
  Moon,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        console.error("Failed to fetch profile");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30 max-w-xl w-full">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 bg-[#ebd98d]/30" />
          <Skeleton className="h-6 w-40 mx-auto mb-2 bg-[#ebd98d]/30" />
          <Skeleton className="h-4 w-48 mx-auto bg-[#ebd98d]/30" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
          <div className="text-red-600">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] p-6">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />

      <div className="max-w-xl mx-auto relative">
        {/* Header with navigation */}
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
              <User className="w-8 h-8 text-[#d2b53b]" />
              My <span className="text-[#d2b53b]">Profile</span>
            </h1>
            <p className="text-[#100e06]/70">
              Your personal information and preferences
            </p>
          </div>
        </div>

        <Card className="bg-white/60 backdrop-blur-sm border border-[#ebd98d]/30 shadow-lg rounded-3xl">
          <CardContent className="flex flex-col items-center gap-6 p-8">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                <AvatarImage
                  src={profile.profileImage || undefined}
                  alt={profile.name || "User"}
                />
                <AvatarFallback className="bg-[#ebd98d] text-[#100e06] text-2xl font-semibold">
                  {profile.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#100e06] mb-1">
                {profile.name}
              </h2>
              <p className="text-[#100e06]/70">{profile.email}</p>
            </div>

            <div className="w-full space-y-4">
              {/* Basic Information */}
              <div className="bg-[#ebd98d]/10 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-[#100e06] mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#d2b53b]" />
                  Basic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Gender:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium capitalize">
                        {profile.gender}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Location:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Occupation:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium">
                        {profile.occupation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-[#ebd98d]/10 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-[#100e06] mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#d2b53b]" />
                  Preferences
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Cleanliness:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium capitalize">
                        {profile.preferences.cleanliness}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <Moon className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Night Owl:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium capitalize">
                        {profile.preferences.nightOwl}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ebd98d]/30 rounded-full flex items-center justify-center">
                      <Cigarette className="w-4 h-4 text-[#d2b53b]" />
                    </div>
                    <div>
                      <span className="font-medium text-[#100e06]/60">
                        Smoker:
                      </span>
                      <span className="ml-2 text-[#100e06] font-medium capitalize">
                        {profile.preferences.smoker}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full pt-4">
              <Link href="/preferences" className="w-full">
                <Button className="w-full bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl py-6 text-lg font-semibold">
                  <Settings className="w-5 h-5 mr-2" />
                  Update Preferences
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
