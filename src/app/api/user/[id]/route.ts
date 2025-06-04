import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: otherId } = await params;
    if (!otherId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the single user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: otherId,
      },
      select: {
        id: true,
        image: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching single user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user due to an internal server error." },
      { status: 500 }
    );
  }
}