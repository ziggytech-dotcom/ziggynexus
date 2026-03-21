# NexusIQ™ — ZiggyTech Creative Client Portal

> Your agency work. One place. Always approved before it goes live.

## What This Is

NexusIQ is the client-facing portal where ZiggyTech Creative delivers all work. Clients log in, see everything being built for them, approve or leave notes, and track progress. **Nothing goes live without client approval through NexusIQ.**

## Stack

- **Next.js 15** — App Router
- **TypeScript** — full type safety
- **Tailwind CSS v4** — styling
- **Supabase** — auth (magic link) + database + RLS
- **ZTC Design System** — #050505 bg, #C9A96E gold, Playfair Display + Inter

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Magic link auth via Supabase |
| `/dashboard` | Client overview — project status, pending count, recent activity |
| `/approvals` | Approval queue — all items pending review |
| `/approvals/[id]` | Single item — preview + Approve/Request Changes/Reject + comments |
| `/assets` | Deliverable library — organized by type |
| `/assets/[id]` | Asset detail — preview, version history, feedback thread |
| `/calendar` | Social content calendar — weekly posts for review |

## Key Component

`components/ApprovalCard.tsx` — the core interaction component:
- Shows deliverable preview
- **Approve** → updates status, logs timestamp
- **Request Changes** → opens notes modal, saves comment, notifies team
- **Reject** → confirmation modal, reason required, logs rejection

## Supabase Setup

Project: `ziggytech-apps` — https://tabrmsrxtqnuwivgwggb.supabase.co

Run migration:
```bash
# Via Supabase dashboard > SQL Editor
# File: supabase/migrations/001_nexusiq_schema.sql
```

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deployment

```bash
vercel deploy --prod
# Domain: nexus.ziggytechcreative.com
```

## Phase Roadmap

- **Phase 1** ✅ — Notion workspace per client (see `~/.openclaw/workspace/nexusiq/`)
- **Phase 2** 🔄 — This Next.js portal (you are here)
- **Phase 3** — Spin into standalone SaaS product for other agencies

---

*Powered by ZiggyIQ Suite™ | ZiggyTech Creative | ziggytechcreative.com*
