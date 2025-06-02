"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ArrowLeft, MapPin, User, Briefcase, Home, Moon, Cigarette, Save } from "lucide-react"
import { MdCleaningServices } from "react-icons/md";

interface Preferences {
  cleanliness: string
  nightOwl: string
  smoker: string
}

interface FormData {
  location: string
  gender: string
  occupation: string
  preferences: Preferences
}

export default function PreferencesPage() {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    location: "",
    gender: "",
    occupation: "",
    preferences: { cleanliness: "", nightOwl: "", smoker: "" },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true)
      setError(null)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return router.push("/auth")

        // load existing prefs
        const res = await fetch("/api/preferences")
        if (res.ok) {
          const p: FormData = await res.json()
          setForm({
            location: p.location || "",
            gender: p.gender || "",
            occupation: p.occupation || "",
            preferences: {
              cleanliness: p.preferences?.cleanliness || "",
              nightOwl: p.preferences?.nightOwl || "",
              smoker: p.preferences?.smoker || "",
            },
          })
        } else if (res.status === 401) {
          setError("Session expired or unauthorized. Please log in again.")
          router.push("/auth")
        } else {
          const errorData = await res.json()
          setError(`Failed to load preferences: ${errorData.error || res.statusText}`)
          console.error("Failed to load preferences:", errorData)
        }
      } catch (err: any) {
        console.error("Error loading preferences:", err)
        setError(`An unexpected error occurred: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [router])

  const handleInputChange = (name: string, value: string) => {
    if (["cleanliness", "nightOwl", "smoker"].includes(name)) {
      setForm((f) => ({
        ...f,
        preferences: { ...f.preferences, [name]: value },
      }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success("Preferences saved successfully!")
        router.push("/match")
      } else if (res.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.")
        router.push("/auth")
      } else {
        const errorData = await res.json()
        toast.error(`Failed to save preferences: ${errorData.error || res.statusText}`)
        console.error("Failed to save preferences:", errorData)
      }
    } catch (err: any) {
      console.error("Error saving preferences:", err)
      toast.error(`An unexpected error occurred while saving: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#d2b53b] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#100e06]">Loading your preferences...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f1] flex items-center justify-center p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link href="/auth">
            <Button className="bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white">Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf9f1] p-6">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#100e06]/70 hover:text-[#100e06] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#100e06] mb-2">
              Set Your <span className="text-[#d2b53b]">Preferences</span>
            </h1>
            <p className="text-[#100e06]/70">Help us find your perfect roommate match</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#ebd98d]/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#100e06] flex items-center gap-2">
                <User className="w-5 h-5 text-[#d2b53b]" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#100e06] font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter your city"
                    className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-[#100e06] font-medium">
                    Gender
                  </Label>
                  <Select value={form.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-Binary</SelectItem>
                      <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-[#100e06] font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={form.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="What do you do for work?"
                  className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl"
                />
              </div>
            </div>

            {/* Lifestyle Preferences */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#100e06] flex items-center gap-2">
                <Home className="w-5 h-5 text-[#d2b53b]" />
                Lifestyle Preferences
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleanliness" className="text-[#100e06] font-medium flex items-center gap-2">
                    <MdCleaningServices className="w-4 h-4" />
                    Cleanliness Level
                  </Label>
                  <Select
                    value={form.preferences.cleanliness}
                    onValueChange={(value) => handleInputChange("cleanliness", value)}
                  >
                    <SelectTrigger className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neat">Very Neat</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="messy">Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nightOwl" className="text-[#100e06] font-medium flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Night Owl?
                  </Label>
                  <Select
                    value={form.preferences.nightOwl}
                    onValueChange={(value) => handleInputChange("nightOwl", value)}
                  >
                    <SelectTrigger className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I stay up late</SelectItem>
                      <SelectItem value="no">No, I sleep early</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smoker" className="text-[#100e06] font-medium flex items-center gap-2">
                    <Cigarette className="w-4 h-4" />
                    Smoker?
                  </Label>
                  <Select value={form.preferences.smoker} onValueChange={(value) => handleInputChange("smoker", value)}>
                    <SelectTrigger className="bg-white/50 border-[#ebd98d]/50 focus:border-[#d2b53b] rounded-xl">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-[#d2b53b] hover:bg-[#d2b53b]/90 text-white rounded-xl py-6 text-lg font-semibold"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Preferences...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save & Find Matches
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Alternative Navigation */}
        <div className="mt-6 text-center">
          <Link href="/match" className="text-[#d2b53b] hover:text-[#d2b53b]/80 font-medium">
            Skip for now and browse matches →
          </Link>
        </div>
      </div>
    </div>
  )
}
