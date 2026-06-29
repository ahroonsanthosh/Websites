import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json');
const CMS_PASSWORD = process.env.CMS_PASSWORD ?? 'loka-admin-2024';

export async function GET() {
  try {
    const content = JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, content } = await req.json();

    if (password !== CMS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
