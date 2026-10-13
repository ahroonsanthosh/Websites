# Salon Cancellation Matching — MVP

Replaces manual texting/cross-referencing with an automated cancellation-to-waitlist matcher.

## Stack
Next.js (App Router, single deployable app) · Supabase Postgres · Twilio SMS · Vercel.

## Setup

1. Create a Supabase project, run the migrations in `supabase/migrations/` (SQL editor or CLI) in order.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
   - `NEXT_PUBLIC_APP_URL` (used to build claim links in SMS)
   - `CRON_SECRET` (optional, protects the expiry cron endpoint)
3. `npm install && npm run dev`
4. Seed migration creates a demo salon at slug `demo-salon` — intake link is `/intake/demo-salon`.

## Pages
- `/intake/[slug]` — public client intake form (Instagram bio link target)
- `/staff/cancel` — internal cancellation logging form
- `/dashboard` — pending intakes, open slots, match history, manual assign override
- `/claim/[token]` — client-facing claim page sent via SMS

## How matching works
On every new `cancellation_slots` insert, `matchSlot()` (`src/lib/matching.ts`) finds the
oldest pending `intake_requests` row with the same treatment whose `[earliest_time, latest_time]`
window covers the slot's start time, creates an `offered` match with a single-use claim token,
and texts the client a link expiring in 15 minutes.

`GET /api/cron/expire-offers` (wired via `vercel.json` to run every minute) finds offers past
`expires_at`, marks them expired, reopens the slot, and re-runs `matchSlot()` to cascade to the
next waiting client. Point Vercel Cron (or any scheduler) at this endpoint with header
`Authorization: Bearer $CRON_SECRET` if set.

## Race-condition safety
The claim endpoint (`POST /api/claim/[token]`) does a conditional `UPDATE ... WHERE status =
'offered'`, and the DB additionally enforces a partial unique index
(`matches(slot_id) WHERE status = 'claimed'`) — so at most one concurrent claim can ever win,
even under a true simultaneous race.

## Manual override
Staff can force-assign any open slot to any pending intake from the dashboard
("Manual assign") in case the automatic matching picks the wrong client.

## Boundaries (by design, not gaps)
No payments. No free-text SMS parsing — salons use the form. Single SMS provider (Twilio).
Matching is a plain rule (treatment match, then longest wait) — no scoring/ML.
