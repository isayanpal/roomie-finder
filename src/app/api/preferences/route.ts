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
  return NextResponse.json(
    pref || {
      location: "",
      gender: "",
      occupation: "",
      preferences: { cleanliness: "", nightOwl: "", smoker: "" },
      userName: "",
      userImage: "",
    }
  );
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
