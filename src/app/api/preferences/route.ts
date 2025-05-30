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
  });
  return NextResponse.json(
    pref || {
      location: "",
      gender: "",
      occupation: "",
      preferences: { cleanliness: "", nightOwl: "", smoker: "" },
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

  const p = await prisma.preference.upsert({
    where: { userId: session.user.id },
    update: { location, gender, occupation, preferences },
    create: {
      userId: session.user.id,
      location,
      gender,
      occupation,
      preferences,
    },
  });
  return NextResponse.json(p);
}
