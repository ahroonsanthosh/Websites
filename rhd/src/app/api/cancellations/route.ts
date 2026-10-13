import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { matchSlot } from "@/lib/matching";
import { TREATMENT_TYPES } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salonSlug, treatment, startTime, durationMinutes, stylistId } = body;

  if (!salonSlug || !treatment || !startTime || !durationMinutes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!TREATMENT_TYPES.includes(treatment)) {
    return NextResponse.json({ error: "Invalid treatment type" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: salon, error: salonErr } = await db
    .from("salons")
    .select("id")
    .eq("slug", salonSlug)
    .single();

  if (salonErr || !salon) {
    return NextResponse.json({ error: "Salon not found" }, { status: 404 });
  }

  const { data: slot, error: slotErr } = await db
    .from("cancellation_slots")
    .insert({
      salon_id: salon.id,
      stylist_id: stylistId || null,
      treatment,
      start_time: startTime,
      duration_minutes: durationMinutes,
      status: "open",
    })
    .select()
    .single();

  if (slotErr || !slot) {
    return NextResponse.json({ error: "Could not save cancellation slot" }, { status: 500 });
  }

  const match = await matchSlot(slot.id);

  return NextResponse.json({ ok: true, slot, matched: !!match });
}
