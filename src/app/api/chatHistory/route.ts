import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";


export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const [senders, receivers] = await Promise.all([
    prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ["senderId"],
    }),
    prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    }),
  ]);

  const userIds = new Set<string>([
    ...senders.map((m) => m.senderId),
    ...receivers.map((m) => m.receiverId),
  ]);

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
