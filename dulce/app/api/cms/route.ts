import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.ts");
const CMS_PASSWORD = process.env.CMS_PASSWORD || "dulce2024";

// Simple TS content extractor — reads the JSON-like object from content.ts
async function readContent() {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  // Extract the siteContent object literal
  const match = raw.match(/export const siteContent = ({[\s\S]*?});\s*\nexport/);
  if (!match) throw new Error("Could not parse content file");
  // Use Function to evaluate the object literal safely
  // eslint-disable-next-line no-new-func
  const obj = new Function(`return (${match[1]})`)();
  return obj;
}

async function writeContent(content: Record<string, unknown>) {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  const json = JSON.stringify(content, null, 2)
    .replace(/"([^"]+)":/g, "$1:") // unquote keys
    .replace(/"/g, '"'); // keep string values
  const updated = raw.replace(
    /export const siteContent = {[\s\S]*?};\s*\nexport/,
    `export const siteContent = ${json};\n\nexport`
  );
  await fs.writeFile(CONTENT_PATH, updated, "utf-8");
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-cms-password");
  if (auth !== CMS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-cms-password");
  if (auth !== CMS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await writeContent(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
