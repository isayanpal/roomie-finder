"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send } from "lucide-react"

export default function ChatRoom() {
  const supabase = createClient()
  const { id: otherId } = useParams()
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [me, setMe] = useState<string>("")
  const [isSending, setIsSending] = useState(false)
  const [otherUser, setOtherUser] = useState<any>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        // setIsLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth")
        }
        if (!user) return
        setMe(user.id)

        // Fetch other user details
        const userRes = await fetch(`/api/user/${otherId}`)
        if (userRes.ok) {
          const userData = await userRes.json()
          setOtherUser(userData)
          
        }

        // Mark messages as read
        await fetch(`/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markRead: true, otherUserId: otherId }),
        })

        // Load initial messages
        const res = await fetch(`/api/messages?otherUserId=${otherId}`)
        const initialMsgs = await res.json()
        setMsgs(initialMsgs)

        // Subscribe to real-time messages
        const channel = supabase
          .channel("msgs")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "Message" }, (payload) => {
            const m = payload.new

            // Check if this message belongs to this chat
            if (
              (m.senderId === user.id && m.receiverId === otherId) ||
              (m.senderId === otherId && m.receiverId === user.id)
            ) {
              setMsgs((prev) => {
                // Check if the message ID already exists in the list
                if (prev.some((msg) => msg.id === m.id)) {
                  return prev // Message already exists
                }
                return [...prev, m] // Add new message
              })
            }
          })
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      } catch (error) {
        console.log("Error in chat initialization:", error)
      }
    })()
  }, [otherId, supabase, msgs])

  useEffect(() => {
    const container = bottomRef.current?.parentElement
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [msgs])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const messageContent = input
    setInput("")
    setIsSending(true)

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherId,
          content: messageContent,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Failed to send message:", errorData)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }
  return (
    <div className="bg-[#fbf9f1] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#ebd98d]/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#ebd060]/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#d2b53b]/10 rounded-full blur-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl h-[80vh] bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg flex flex-col overflow-hidden border border-[#ebd98d]/30"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 border-b border-[#ebd98d]/30 shadow-sm p-4 flex items-center justify-between"
        >
          <Link href="/chat/history" className="inline-flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-[#100e06]/70 hover:text-[#100e06] hover:bg-[#ebd98d]/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-medium text-[#100e06] text-[12px]">Back to Chats</span>
          </Link>

          {otherUser && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium text-[#100e06] text-[12px]">{otherUser.name}</p>
              </div>
              <div className="relative">
                <img
                  src={otherUser.image}
                  alt={otherUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                />
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto p-4 bg-[#fbf9f1]/50"
        >
          <AnimatePresence initial={false}>
            {msgs
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .map((m, index) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05 > 0.5 ? 0.5 : index * 0.05,
                  }}
                  className={`flex mb-3 ${m.senderId === me ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                      m.senderId === me
                        ? "bg-[#d2b53b] text-white rounded-br-none"
                        : "bg-white/80 text-[#100e06] rounded-bl-none border border-[#ebd98d]/30"
                    }`}
                  >
                    {m.content}
                  </motion.div>
                </motion.div>
              ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={send}
          className="border-t border-[#ebd98d]/30 p-3 flex items-center bg-white/80"
        >
          <input
            className="flex-1 px-4 py-3 border border-[#ebd98d]/50 rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#d2b53b] focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={isSending}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSending || !input.trim()}
            className={`ml-2 p-3 rounded-full ${
              input.trim() ? "bg-[#d2b53b] text-white" : "bg-[#ebd98d]/30 text-[#100e06]/50"
            } flex items-center justify-center`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
