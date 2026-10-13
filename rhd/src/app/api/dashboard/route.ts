import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const db = supabaseAdmin();

  const salonQuery = db.from("salons").select("id, name, slug");
  const { data: salon } = slug
    ? await salonQuery.eq("slug", slug).single()
    : await salonQuery.order("created_at", { ascending: true }).limit(1).single();

  if (!salon) {
    return NextResponse.json({ error: "No salon found" }, { status: 404 });
  }

  const [{ data: pendingIntakes }, { data: openSlots }, { data: matches }] = await Promise.all([
    db
      .from("intake_requests")
      .select("id, treatment, earliest_time, latest_time, created_at, clients(name, phone)")
      .eq("salon_id", salon.id)
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    db
      .from("cancellation_slots")
      .select("id, treatment, start_time, duration_minutes, status, stylists(name)")
      .eq("salon_id", salon.id)
      .in("status", ["open", "offered"])
      .order("start_time", { ascending: true }),
    db
      .from("matches")
      .select(
        "id, status, offered_at, expires_at, responded_at, cancellation_slots(treatment, start_time), intake_requests(clients(name, phone))"
      )
      .eq("salon_id", salon.id)
      .order("offered_at", { ascending: false })
      .limit(25),
  ]);

  return NextResponse.json({
    salon,
    pendingIntakes: pendingIntakes || [],
    openSlots: openSlots || [],
    matches: matches || [],
  });
}
