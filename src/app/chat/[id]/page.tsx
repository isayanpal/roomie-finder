"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatRoom() {
  const supabase = createClient();
  const { id: otherId } = useParams();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [me, setMe] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      }
      if (!user) return;
      setMe(user.id);

      // Mark messages as read
      await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markRead: true, otherUserId: otherId }),
      });

      // Load initial messages
      const res = await fetch(`/api/messages?otherUserId=${otherId}`);
      const initialMsgs = await res.json();
      setMsgs(initialMsgs);

      // Subscribe to real-time messages
      const channel = supabase
        .channel("msgs")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "Message" },
          (payload) => {
            const m = payload.new;

            // Check if this message belongs to this chat
            if (
              (m.senderId === user.id && m.receiverId === otherId) ||
              (m.senderId === otherId && m.receiverId === user.id)
            ) {
              setMsgs((prev) => {
                // Check if the message ID already exists in the list
                if (prev.some((msg) => msg.id === m.id)) {
                  return prev; // Message already exists
                }
                return [...prev, m]; // Add new message
              });
              // window.location.reload()
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    })();
  }, [otherId, supabase, msgs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageContent = input;
    setInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherId,
          content: messageContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to send message:", errorData);
        return;
      }

      // window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <Link href={"/match"}>
          <Button>{"<-"} Back to Matches</Button>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4 mt-20">
        {msgs
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .map((m) => (
            <div
              key={m.id}
              className={`mb-2 max-w-xs px-3 py-2 rounded ${
                m.senderId === me ? "bg-green-400 ml-auto" : "bg-gray-200"
              }`}
            >
              {m.content}
            </div>
          ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex border-t p-2">
        <input
          className="flex-1 px-3 py-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
