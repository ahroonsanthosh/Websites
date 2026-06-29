import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "ahroonsanthosh";
const GITHUB_REPO = "Uncles";
const BRANCH = "claude/site-review-g0rzhi";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "uncles2025";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const path = `public/images/${safeName}`;

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  // Check if file already exists (to get SHA for upsert)
  let sha: string | undefined;
  try {
    const check = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${BRANCH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } }
    );
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }
  } catch {
    // file doesn't exist yet — fine
  }

  const body: Record<string, unknown> = {
    message: `cms: upload image ${safeName}`,
    content: base64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: res.status });
  }

  // Return the public URL path (relative, works on any deployment)
  return NextResponse.json({ url: `/images/${safeName}` });
}
