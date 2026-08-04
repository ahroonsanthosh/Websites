import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = supabaseAdmin();

  const { data: match } = await db
    .from("matches")
    .select("status, expires_at, slot_id, cancellation_slots(treatment, start_time, duration_minutes)")
    .eq("claim_token", token)
    .single();

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const expired = match.status === "offered" && new Date(match.expires_at) < new Date();

  return NextResponse.json({
    status: expired ? "expired" : match.status,
    expiresAt: match.expires_at,
    slot: match.cancellation_slots,
  });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = supabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data: match } = await db
    .from("matches")
    .select("id, slot_id, intake_request_id, status, expires_at")
    .eq("claim_token", token)
    .single();

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (match.status !== "offered" || new Date(match.expires_at) < new Date()) {
    return NextResponse.json({ error: "expired_or_unavailable" }, { status: 409 });
  }

  // Conditional update: only succeeds if still "offered" at write time.
  // Backed by a partial unique index (matches.slot_id where status='claimed')
  // so even a concurrent race can produce at most one winner.
  const { data: claimed, error: claimErr } = await db
    .from("matches")
    .update({ status: "claimed", responded_at: nowIso })
    .eq("id", match.id)
    .eq("status", "offered")
    .select()
    .single();

  if (claimErr || !claimed) {
    return NextResponse.json({ error: "already_claimed" }, { status: 409 });
  }

  await db.from("cancellation_slots").update({ status: "filled" }).eq("id", match.slot_id);
  await db.from("intake_requests").update({ status: "claimed" }).eq("id", match.intake_request_id);

  return NextResponse.json({ ok: true });
}
