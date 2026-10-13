import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { saveMedia, deleteMedia } from "@/lib/storage";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hansum-jwt-secret-key-change-in-production"
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export async function POST(request: NextRequest) {
  const authed = await authenticate(request);
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const safeName = `${Date.now()}-${sanitizeFilename(file.name.replace(`.${ext}`, ""))}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveMedia(safeName, buffer, file.type);

    return NextResponse.json({ url, filename: safeName });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authed = await authenticate(request);
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { filename } = await request.json();
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // deleteMedia handles both Blob URLs and local paths, and guards traversal.
    await deleteMedia(filename);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
