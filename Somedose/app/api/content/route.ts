import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";

export async function GET() {
  try { return NextResponse.json(getContent()); }
  catch { return NextResponse.json({ error: "Failed to read content" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== (process.env.ADMIN_PASSWORD || "somedose2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try { saveContent(await req.json()); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: "Failed to save" }, { status: 500 }); }
}
