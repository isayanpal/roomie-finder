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

  const senderIds = groups.map((g) => g.senderId);
  const users = await prisma.user.findMany({
    where: { id: { in: senderIds } },
    select: { id: true, name: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
  const result = groups.map((g) => ({
    senderId: g.senderId,
    count: g._count.senderId,
    senderName: userMap[g.senderId] || "Unknown",
  }));

  return NextResponse.json(result);
}
