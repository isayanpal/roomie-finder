import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const groups = await prisma.message.groupBy({
    by: ["senderId"],
    where: { receiverId: session.user.id, read: false },
    _count: { senderId: true },
  });

  const result = await Promise.all(
    groups.map(async (g) => {
      const u = await prisma.user.findUnique({ where: { id: g.senderId } });
      return {
        senderId: g.senderId,
        count: g._count.senderId,
        senderName: u?.name || "Unknown",
      };
    })
  );

  return NextResponse.json(result);
}
