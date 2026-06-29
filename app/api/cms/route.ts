import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "ahroonsanthosh";
const GITHUB_REPO = "Uncles";
const CONTENT_PATH = "content/content.json";
const BRANCH = "claude/rotisserie-deli-website-dxo9mp";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "uncles2025";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) return unauthorized();

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
  );
  if (!res.ok) return NextResponse.json({ error: `GitHub error: ${res.status}` }, { status: res.status });

  const data = await res.json();
  const content = JSON.parse(Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8"));
  return NextResponse.json({ content, sha: data.sha });
}

async function getCurrentSha(): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

export async function PUT(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) return unauthorized();

  const { content, sha: clientSha } = await req.json();
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

  const tryPut = async (sha: string) =>
    fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
      {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "cms: update site content", content: encoded, sha, branch: BRANCH }),
      }
    );

  let res = await tryPut(clientSha);

  // SHA mismatch — re-fetch the current SHA and retry once
  if (res.status === 409 || res.status === 422) {
    const freshSha = await getCurrentSha();
    if (freshSha) res = await tryPut(freshSha);
  }

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message || "Save failed" }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json({ sha: data.content.sha });
}
