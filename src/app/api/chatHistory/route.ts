// app/api/chatHistory/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";


export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Get unique users the current user has chatted with (sent or received)
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  const userIds = new Set<string>();
  messages.forEach((msg) => {
    if (msg.senderId !== userId) userIds.add(msg.senderId);
    if (msg.receiverId !== userId) userIds.add(msg.receiverId);
  });

  const users = await prisma.user.findMany({
    where: {
      id: { in: Array.from(userIds) },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return NextResponse.json(users);
}
