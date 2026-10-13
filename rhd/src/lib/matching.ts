import crypto from "crypto";
import { supabaseAdmin } from "./supabase";
import { sendSms } from "./twilio";
import { TREATMENT_LABELS, TreatmentType } from "./types";

const OFFER_TTL_MINUTES = 15;

/**
 * Finds the best-waiting pending intake request for an open slot and creates
 * an "offered" match, texting the client a claim link. No-ops if nothing matches.
 */
export async function matchSlot(slotId: string) {
  const db = supabaseAdmin();

  const { data: slot, error: slotErr } = await db
    .from("cancellation_slots")
    .select("id, salon_id, treatment, start_time, status")
    .eq("id", slotId)
    .single();

  if (slotErr || !slot || slot.status !== "open") return null;

  const { data: candidates, error: candErr } = await db
    .from("intake_requests")
    .select("id, client_id, earliest_time, latest_time")
    .eq("salon_id", slot.salon_id)
    .eq("treatment", slot.treatment as TreatmentType)
    .eq("status", "pending")
    .lte("earliest_time", slot.start_time)
    .gte("latest_time", slot.start_time)
    .order("created_at", { ascending: true })
    .limit(1);

  if (candErr || !candidates || candidates.length === 0) return null;

  const winner = candidates[0];
  const claimToken = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + OFFER_TTL_MINUTES * 60_000).toISOString();

  const { data: match, error: matchErr } = await db
    .from("matches")
    .insert({
      salon_id: slot.salon_id,
      slot_id: slot.id,
      intake_request_id: winner.id,
      status: "offered",
      claim_token: claimToken,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (matchErr || !match) return null;

  await db.from("cancellation_slots").update({ status: "offered" }).eq("id", slot.id);
  await db.from("intake_requests").update({ status: "offered" }).eq("id", winner.id);

  const { data: client } = await db
    .from("clients")
    .select("phone, name")
    .eq("id", winner.client_id)
    .single();

  if (client?.phone) {
    const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${claimToken}`;
    const treatmentLabel = TREATMENT_LABELS[slot.treatment as TreatmentType] ?? slot.treatment;
    await sendSms(
      client.phone,
      `A ${treatmentLabel} slot just opened up! Claim it within 15 minutes: ${claimUrl}`
    );
  }

  return match;
}

/**
 * Finds offered matches past their expiry, marks them expired, reopens the
 * slot, and cascades the offer to the next waiting client.
 */
export async function expireStaleOffersAndCascade() {
  const db = supabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data: stale, error } = await db
    .from("matches")
    .select("id, slot_id, intake_request_id")
    .eq("status", "offered")
    .lt("expires_at", nowIso);

  if (error || !stale || stale.length === 0) return { expired: 0 };

  for (const m of stale) {
    await db.from("matches").update({ status: "expired", responded_at: nowIso }).eq("id", m.id);
    await db.from("intake_requests").update({ status: "expired" }).eq("id", m.intake_request_id);
    await db.from("cancellation_slots").update({ status: "open" }).eq("id", m.slot_id);
    await matchSlot(m.slot_id);
  }

  return { expired: stale.length };
}
