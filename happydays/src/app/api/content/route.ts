import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSiteDataSync, writeSiteData } from '@/lib/content'

export async function GET() {
  const data = getSiteDataSync()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('hd-admin')

  if (!authCookie || authCookie.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    writeSiteData(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
