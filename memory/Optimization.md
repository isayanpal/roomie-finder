# Roomie Finder — Optimization Context

## Goal
Fix correctness bugs + perf issues without breaking existing functionality.
Full plan: `~/.claude/plans/gentle-stirring-hedgehog.md`

---

## Progress

| # | Description | File(s) | Status |
|---|-------------|---------|--------|
| 1 | `getSession` → `getUser` in API routes | `api/matches`, `api/chatHistory`, `api/preferences`, `api/messages` | ✅ DONE |
| 2 | N+1 query in unreadMessages | `api/unreadMessages/route.ts` | ✅ DONE |
| 3 | Parallel fetches in match page | `app/match/page.tsx` | ✅ DONE |
| 4 | Remove sort-on-render in chat | `app/chat/[id]/page.tsx` | ✅ DONE |
| 5 | `createClient()` to module scope | `match/page.tsx`, `preferences/page.tsx`, `ChatHistory.tsx` | ✅ DONE |
| 6 | Chat useEffect re-subscribe bug | `app/chat/[id]/page.tsx` | ✅ DONE |
| 7 | chatHistory full table scan | `api/chatHistory/route.ts` | ✅ DONE |
| 8 | `<img>` → `next/image` | `ChatHistory.tsx`, `chat/[id]/page.tsx` | ✅ DONE |

---

## Completed Changes

### ✅ #6 — Chat page re-subscribes on every message
**File:** `src/app/chat/[id]/page.tsx`

**Root cause:** `useEffect` dep array was `[otherId, supabase, msgs]`. Every new message updated
`msgs` → effect cleanup → channel torn down → re-subscribed. Race conditions + wasted connections.

**Fix:** Split into two `useEffect` blocks:
- `useEffect([otherId])` — auth, initial message load, mark-read, fetch other user. 3 fetches parallelized with `Promise.all`.
- `useEffect([otherId, me])` — realtime subscription only. Uses `setMsgs(prev => ...)` so no closure over `msgs`. Guards with `if (!me) return`. Channel name scoped to `msgs-{otherId}-{me}`.

Also moved `createClient()` to module scope (was re-creating on every render).

**Regression caught + fixed:** Old code accidentally re-fetched all messages on every `msgs` change,
making the sender's own sent message appear via re-fetch (not realtime). New clean code relied purely
on Supabase realtime which doesn't guarantee the sender receives their own INSERT event.
Fix: `send()` now adds the API response directly to `msgs` state with dedup check.
Realtime still handles incoming messages from other users.

---

### ✅ #2 — N+1 query in unreadMessages
**File:** `src/app/api/unreadMessages/route.ts`

**Root cause:** `Promise.all(groups.map(g => prisma.user.findUnique(...)))` — one DB query per unread sender.

**Fix:** Single `prisma.user.findMany({ where: { id: { in: senderIds } } })` + map lookup.
Output shape `{ senderId, count, senderName }[]` unchanged.

---

## Deferred / Out of Scope

- Preference table denormalization (`userName`/`userImage`) — schema change, separate PR
- Move match scoring to server — changes API contract
- Conversation join table — schema migration
