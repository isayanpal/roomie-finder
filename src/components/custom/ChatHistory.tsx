'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string;
  image: string;
}

export default function ChatHistory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);
      const res = await fetch("/api/chatHistory");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading chat history...</div>;
  }

  if (!loggedIn) {
    return (
      <div className="p-4 text-red-600 font-medium">
        You must be logged in to view your chat history.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chat History</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No past conversations yet.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => router.push(`/chat/${user.id}`)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <img
                src={user.image || "/placeholder.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-lg">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
