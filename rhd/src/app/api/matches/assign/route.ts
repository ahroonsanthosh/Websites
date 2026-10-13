import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSms } from "@/lib/twilio";
import { TREATMENT_LABELS, TreatmentType } from "@/lib/types";

const OFFER_TTL_MINUTES = 15;

// Manual override: salon staff force-assigns a specific slot to a specific
// intake request, bypassing the auto-matching ranking.
export async function POST(req: NextRequest) {
  const { slotId, intakeRequestId } = await req.json();
  if (!slotId || !intakeRequestId) {
    return NextResponse.json({ error: "Missing slotId or intakeRequestId" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: slot } = await db
    .from("cancellation_slots")
    .select("id, salon_id, treatment, status")
    .eq("id", slotId)
    .single();
  if (!slot || slot.status !== "open") {
    return NextResponse.json({ error: "Slot is not open" }, { status: 409 });
  }

  const { data: intake } = await db
    .from("intake_requests")
    .select("id, client_id, status")
    .eq("id", intakeRequestId)
    .single();
  if (!intake || intake.status !== "pending") {
    return NextResponse.json({ error: "Intake request is not pending" }, { status: 409 });
  }

  const claimToken = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + OFFER_TTL_MINUTES * 60_000).toISOString();

  const { data: match, error: matchErr } = await db
    .from("matches")
    .insert({
      salon_id: slot.salon_id,
      slot_id: slot.id,
      intake_request_id: intake.id,
      status: "offered",
      claim_token: claimToken,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (matchErr || !match) {
    return NextResponse.json({ error: "Could not create match" }, { status: 500 });
  }

  await db.from("cancellation_slots").update({ status: "offered" }).eq("id", slot.id);
  await db.from("intake_requests").update({ status: "offered" }).eq("id", intake.id);

  const { data: client } = await db
    .from("clients")
    .select("phone")
    .eq("id", intake.client_id)
    .single();

  if (client?.phone) {
    const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${claimToken}`;
    const label = TREATMENT_LABELS[slot.treatment as TreatmentType] ?? slot.treatment;
    await sendSms(
      client.phone,
      `A ${label} slot just opened up! Claim it within 15 minutes: ${claimUrl}`
    );
  }

  return NextResponse.json({ ok: true, match });
}
