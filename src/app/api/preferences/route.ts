import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json(null, { status: 401 });
  const pref = await prisma.preference.findUnique({
    where: {
      userId: session.user.id,
    },
    include: { user: { select: { name: true, image: true } } },
  });
 // Handle case where no preferences exist
  if (!pref) {
    return NextResponse.json({
      location: "",
      gender: "",
      occupation: "",
      preferences: { cleanliness: "", nightOwl: "", smoker: "" },
      userName: "",
      userImage: "",
    });
  }

    // Cast preferences from Prisma.JsonValue to expected object
  const preferences = pref.preferences as {
    cleanliness?: string;
    nightOwl?: string;
    smoker?: string;
  };

  // Normalize values to lowercase safely
  const cleaned = {
    location: pref.location?.toLowerCase() || "",
    gender: pref.gender?.toLowerCase() || "",
    occupation: pref.occupation?.toLowerCase() || "",
    preferences: {
      cleanliness: preferences?.cleanliness || "",
      nightOwl: preferences?.nightOwl || "",
      smoker: preferences?.smoker || "",
    },
    userName: pref.user?.name || "",
    userImage: pref.user?.image || "",
  };

  return NextResponse.json(cleaned);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const { location, gender, occupation, preferences } = await req.json();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json(null, { status: 401 });

  // Fetch the user's name and image from the User model
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const p = await prisma.preference.upsert({
    where: { userId: session.user.id },
    update: {
      location,
      gender,
      occupation,
      preferences,
      userName: user.name ?? "",
      userImage: user.image ?? "",
    },
    create: {
      userId: session.user.id,
      location,
      gender,
      occupation,
      preferences,
      userName: user.name ?? "",
      userImage: user.image ?? "",
    },
  });
  return NextResponse.json(p);
}
