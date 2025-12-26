"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/constants/interfaces";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Cigarette,
  Home,
  MapPin,
  Moon,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdPerson } from "react-icons/io";
import { MdCleaningServices } from "react-icons/md";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PreferencesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    location: "",
    gender: "",
    occupation: "",
    preferences: { cleanliness: "", nightOwl: "", smoker: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return router.push("/auth");

        // load existing prefs
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const p: FormData = await res.json();
          setForm({
            location: p.location || "",
            gender: p.gender || "",
            occupation: p.occupation || "",
            preferences: {
              cleanliness: p.preferences?.cleanliness || "",
              nightOwl: p.preferences?.nightOwl || "",
              smoker: p.preferences?.smoker || "",
            },
          });
        } else if (res.status === 401) {
          setError("Session expired or unauthorized. Please log in again.");
          router.push("/auth");
        } else {
          const errorData = await res.json();
          setError(
            `Failed to load preferences: ${errorData.error || res.statusText}`
          );
          console.error("Failed to load preferences:", errorData);
        }
      } catch (err: any) {
        console.error("Error loading preferences:", err);
        setError(`An unexpected error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [router]);

  const handleInputChange = (name: string, value: string) => {
    if (["cleanliness", "nightOwl", "smoker"].includes(name)) {
      setForm((f) => ({
        ...f,
        preferences: { ...f.preferences, [name]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.location.trim() ||
      !form.gender.trim() ||
      !form.occupation.trim() ||
      !form.preferences.cleanliness.trim() ||
      !form.preferences.nightOwl.trim() ||
      !form.preferences.smoker.trim()
    ) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Preferences saved successfully!");
        router.push("/match");
      } else if (res.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        router.push("/auth");
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to save preferences: ${errorData.error || res.statusText}`
        );
        console.error("Failed to save preferences:", errorData);
      }
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      toast.error(`An unexpected error occurred while saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center overflow-hidden relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#ebd98d]/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d2b53b]/20 rounded-full blur-[120px] animate-pulse" />

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#d2b53b] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#100e06] font-medium tracking-wide">
              Loading your preferences...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-red-200/50 max-w-md w-full text-center relative z-10">
          <div className="text-red-500 font-medium mb-6 bg-red-50/50 py-3 px-4 rounded-xl border border-red-100">
            {error}
          </div>
          <Link href="/auth">
            <Button className="bg-[#d2b53b] hover:bg-[#bfa330] text-white w-full rounded-xl py-6 shadow-lg shadow-[#d2b53b]/20 transition-all hover:scale-[1.02]">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] p-4 md:p-8 relative w-screen left-[calc(-50vw+50%)] overflow-hidden font-poppins">
      {/* Dynamic Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#ebd98d]/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-[#d2b53b]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-[#ebd060]/15 rounded-full blur-[100px]" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-12">
          <Link href="/" className="inline-block group">
            <Button
              variant="ghost"
              className="bg-white/50 hover:bg-white/80 text-[#100e06]/80 hover:text-[#100e06] rounded-full px-5 py-2.5 flex items-center gap-2 backdrop-blur-sm border border-white/40 transition-all duration-300 shadow-sm hover:shadow-md mb-6"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Button>
          </Link>

          <div className="text-center space-y-3">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-[#100e06]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Curate Your <span className="text-[#d2b53b]">Vibe</span>
            </motion.h1>
            <motion.p
              className="text-[#100e06]/60 text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Tell us what makes you tick so we can find your perfect match.
            </motion.p>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-white/60 relative overflow-hidden"
        >
          {/* Glass Sheen Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-10 relative">
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#ebd98d]/30 pb-4 mb-6">
                <div className="p-2.5 bg-[#d2b53b]/10 rounded-2xl text-[#d2b53b]">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#100e06]">
                  The Basics
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="location"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </Label>
                  <div className="relative group">
                    <Input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Where do you live?"
                      className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:bg-white focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] placeholder:text-[#100e06]/30 shadow-sm group-hover:bg-white/90"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="gender"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <IoMdPerson className="w-3.5 h-3.5" /> Gender
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] shadow-sm hover:bg-white/90 data-[state=open]:bg-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50 rounded-2xl shadow-xl p-2">
                      {[
                        { val: "male", label: "Male" },
                        { val: "female", label: "Female" },
                        { val: "non-binary", label: "Non-Binary" },
                        { val: "prefer-not-say", label: "Prefer not to say" },
                      ].map((opt) => (
                        <SelectItem
                          key={opt.val}
                          value={opt.val}
                          className="rounded-xl focus:bg-[#d2b53b]/10 focus:text-[#d2b53b] cursor-pointer py-2.5 font-medium"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <Label
                    htmlFor="occupation"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Occupation
                  </Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={form.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    placeholder="e.g. Graphic Designer"
                    className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:bg-white focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] placeholder:text-[#100e06]/30 shadow-sm hover:bg-white/90"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Lifestyle */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#ebd98d]/30 pb-4 mb-6">
                <div className="p-2.5 bg-[#d2b53b]/10 rounded-2xl text-[#d2b53b]">
                  <Home className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#100e06]">Lifestyle</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="cleanliness"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <MdCleaningServices className="w-3.5 h-3.5" /> Cleanliness
                  </Label>
                  <Select
                    value={form.preferences.cleanliness}
                    onValueChange={(value) =>
                      handleInputChange("cleanliness", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] shadow-sm hover:bg-white/90">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50 rounded-2xl shadow-xl p-2">
                      {[
                        { val: "neat", label: "Very Neat" },
                        { val: "average", label: "Average" },
                        { val: "messy", label: "Relaxed" },
                      ].map((opt) => (
                        <SelectItem
                          key={opt.val}
                          value={opt.val}
                          className="rounded-xl focus:bg-[#d2b53b]/10 focus:text-[#d2b53b] cursor-pointer py-2.5 font-medium"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="nightOwl"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <Moon className="w-3.5 h-3.5" /> Sleep Schedule
                  </Label>
                  <Select
                    value={form.preferences.nightOwl}
                    onValueChange={(value) =>
                      handleInputChange("nightOwl", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] shadow-sm hover:bg-white/90">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50 rounded-2xl shadow-xl p-2">
                      {[
                        { val: "yes", label: "Night Owl 🦉" },
                        { val: "no", label: "Early Bird 🌅" },
                      ].map((opt) => (
                        <SelectItem
                          key={opt.val}
                          value={opt.val}
                          className="rounded-xl focus:bg-[#d2b53b]/10 focus:text-[#d2b53b] cursor-pointer py-2.5 font-medium"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="smoker"
                    className="text-[#100e06]/80 font-medium text-sm ml-1 flex items-center gap-2"
                  >
                    <Cigarette className="w-3.5 h-3.5" /> Smoking
                  </Label>
                  <Select
                    value={form.preferences.smoker}
                    onValueChange={(value) =>
                      handleInputChange("smoker", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/70 border-transparent focus:border-[#d2b53b]/50 focus:ring-4 focus:ring-[#d2b53b]/10 rounded-2xl transition-all duration-300 font-medium text-[#100e06] shadow-sm hover:bg-white/90">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50 rounded-2xl shadow-xl p-2">
                      {[
                        { val: "yes", label: "Yes" },
                        { val: "no", label: "No" },
                      ].map((opt) => (
                        <SelectItem
                          key={opt.val}
                          value={opt.val}
                          className="rounded-xl focus:bg-[#d2b53b]/10 focus:text-[#d2b53b] cursor-pointer py-2.5 font-medium"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="w-full h-14 bg-[#d2b53b] hover:bg-[#bfa330] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#d2b53b]/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {saving ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving your profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    <span>Save Preferences & Find Match</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer Link */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <Link
            href="/match"
            className="inline-flex items-center gap-1 text-[#d2b53b] hover:text-[#bfa330] font-medium transition-colors border-b border-transparent hover:border-[#d2b53b]/50 pb-0.5"
          >
            Skip for now and browse matches <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
