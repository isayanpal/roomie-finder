// route.ts
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("otherUserId");
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !otherUserId) {
    return NextResponse.json([], { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  // Handle marking messages as read
  // The client will send { markRead: true, otherUserId: "..." }
  if (body.markRead && body.otherUserId) {
    const { otherUserId } = body;
    try {
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: session.user.id,
          read: false,
        },
        data: { read: true },
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
    }
  }

  // Handle sending a new message
  // The client will send { receiverId: "...", content: "..." }
  const { receiverId, content } = body;
  if (receiverId && content && typeof content === 'string' && content.trim() !== '') {
    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId: session.user.id, // The authenticated user is the sender
          receiverId: receiverId,
          content: content,
          read: false, // New messages are initially unread
        },
      });
      // Return the newly created message with a 201 Created status
      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      console.error("Error sending message:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
  }

  // If the request body does not match any expected action
  return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
}
