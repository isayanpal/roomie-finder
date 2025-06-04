import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("Error is fetching other users", error);
    return NextResponse.json(
      { message: "Failed to fetch users due to an internal server error." },
      { status: 500 }
    );
  }
}
