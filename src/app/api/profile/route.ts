import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma" 
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { preference: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const preferences = dbUser.preference?.preferences as Record<string, any> || {};

    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      profileImage: dbUser.image,
      gender: dbUser.preference?.gender || "",
      location: dbUser.preference?.location || "",
      occupation: dbUser.preference?.occupation || "",
      preferences: {
        cleanliness: preferences?.cleanliness || "",
        nightOwl: preferences?.nightOwl || "",
        smoker: preferences?.smoker || "",
      },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
