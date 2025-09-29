import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Tiny query to keep DB awake
    const { error } = await supabase.from("User").select("id").limit(1);

    if (error) throw error;

    return NextResponse.json({
      message: "Supabase is awake 🚀, Server is healthy and alive!",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
