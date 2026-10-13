import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Returns salon + stylists for the staff-facing forms. Single-salon MVP:
// picks the first salon unless ?slug= is provided.
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

  const { data: stylists } = await db
    .from("stylists")
    .select("id, name")
    .eq("salon_id", salon.id)
    .eq("active", true)
    .order("name");

  return NextResponse.json({ salon, stylists: stylists || [] });
}
