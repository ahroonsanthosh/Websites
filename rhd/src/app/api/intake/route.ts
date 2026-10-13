import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { TREATMENT_TYPES } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salonSlug, name, phone, treatment, earliestTime, latestTime, preferredStylistId } = body;

  if (!salonSlug || !name || !phone || !treatment || !earliestTime || !latestTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!TREATMENT_TYPES.includes(treatment)) {
    return NextResponse.json({ error: "Invalid treatment type" }, { status: 400 });
  }
  if (new Date(earliestTime) >= new Date(latestTime)) {
    return NextResponse.json({ error: "Earliest time must be before latest time" }, { status: 400 });
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

  const { data: client, error: clientErr } = await db
    .from("clients")
    .upsert(
      { salon_id: salon.id, name, phone },
      { onConflict: "salon_id,phone" }
    )
    .select()
    .single();

  if (clientErr || !client) {
    return NextResponse.json({ error: "Could not save client" }, { status: 500 });
  }

  const { error: intakeErr } = await db.from("intake_requests").insert({
    salon_id: salon.id,
    client_id: client.id,
    treatment,
    earliest_time: earliestTime,
    latest_time: latestTime,
    preferred_stylist_id: preferredStylistId || null,
    status: "pending",
  });

  if (intakeErr) {
    return NextResponse.json({ error: "Could not save intake request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
