import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { readContent, writeContent } from "@/lib/content";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hansum-jwt-secret-key-change-in-production"
);

const ALLOWED_SECTIONS = ["hero", "menu", "location", "reviews", "gallery", "seo", "settings"];

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("hansum_admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authed = await authenticate(request);
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await readContent(section);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authed = await authenticate(request);
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await writeContent(section, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
