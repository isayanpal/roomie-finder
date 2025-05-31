"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Preferences {
  cleanliness: string;
  nightOwl: string;
  smoker: string;
}

interface FormData {
  location: string;
  gender: string;
  occupation: string;
  preferences: Preferences;
}

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          console.error("Supabase user fetch error:", userError.message);
          setError(
            "Failed to fetch user session. Please try logging in again."
          );
          router.push("/"); // Redirect on error
          return;
        }
        if (!user) return router.push("/auth");

        // load existing prefs
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const p: FormData = await res.json();
          setForm({
            location: p.location || "",
            gender: p.gender || "",
            occupation: p.occupation || "",
            // Ensure preferences object and its properties exist, fallback to empty
            preferences: {
              cleanliness: p.preferences?.cleanliness || "",
              nightOwl: p.preferences?.nightOwl || "",
              smoker: p.preferences?.smoker || "",
            },
          });
        } else if (res.status === 401) {
          // If the API says unauthorized (session expired etc.)
          setError("Session expired or unauthorized. Please log in again.");
          router.push("/");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Preferences saved!");
        router.push("/match");
      } else if (res.status === 401) {
        // If the API says unauthorized (session expired etc.)
        alert("Session expired or unauthorized. Please log in again.");
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(
          `Failed to save preferences: ${errorData.error || res.statusText}`
        );
        console.error("Failed to save preferences:", errorData);
      }
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      alert(`An unexpected error occurred while saving: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        Loading preferences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Your Preferences</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* ... (input and select elements remain the same) ... */}
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-Binary</option>
            <option value="prefer-not-say">Prefer not to say</option>
          </select>
          <input
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            placeholder="Occupation"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="cleanliness"
            value={form.preferences.cleanliness}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Cleanliness</option>
            <option value="neat">Neat</option>
            <option value="average">Average</option>
            <option value="messy">Messy</option>
          </select>
          <select
            name="nightOwl"
            value={form.preferences.nightOwl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Night owl?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <select
            name="smoker"
            value={form.preferences.smoker}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Smoker?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Save & Continue
          </button>
        </form>
      </div>
      <Link href={"/match"}>
        <Button>Find Your Matches</Button>
      </Link>
    </div>
  );
}
