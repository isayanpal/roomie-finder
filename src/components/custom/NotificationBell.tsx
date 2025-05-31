'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';

interface Unread {
  senderId: string;
  count: number;
  senderName: string;
}

const supabase = createClient();

export default function NotificationBell() {
  const [unread, setUnread] = useState<Unread[]>([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // fetch unread grouped
  const fetchUnread = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const res = await fetch('/api/unreadMessages');
    if (res.ok) setUnread(await res.json());
  };

  useEffect(() => {
    fetchUnread();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Message' },
        (payload:any) => {
          const msg = payload.new as any;
          if (msg.receiverId === userId) {
            setUnread((prev) => {
              const ex = prev.find((u) => u.senderId === msg.senderId);
              if (ex) return prev.map((u) => u.senderId === msg.senderId ? { ...u, count: u.count + 1 } : u);
              return [...prev, { senderId: msg.senderId, count: 1, senderName: '...' }];
            });
            toast.success('New message received');
          }
        }
      )
      .subscribe();

    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [userId]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
               14.158V11a6 6 0 00-5-5.917V4a2 2 
               0 10-4 0v1.083A6 6 0 004 11v3.159c0 
               .538-.214 1.055-.595 1.436L2 17h5m5 
               0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded z-50">
          <div className="px-4 py-2 border-b font-semibold">Notifications</div>
          {unread.length === 0 && <div className="p-2 text-gray-500">No unread</div>}
          {unread.map((u) => (
            <button
              key={u.senderId}
              onClick={() => {
                router.push(`/chat/${u.senderId}`);
                // you’d then mark read via API or in chat page
                setUnread(unread.filter((x) => x.senderId !== u.senderId));
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              <span className="font-medium">{u.senderName || u.senderId}</span>
              <span className="text-sm text-gray-600 ml-1">({u.count})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
