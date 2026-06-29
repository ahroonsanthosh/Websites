import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hansum-jwt-secret-key-change-in-production"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Support multiple admins via ADMIN_CREDENTIALS JSON, or single ADMIN_EMAIL/ADMIN_PASSWORD
    let authorized = false;
    if (process.env.ADMIN_CREDENTIALS) {
      try {
        const admins: { email: string; password: string }[] = JSON.parse(process.env.ADMIN_CREDENTIALS);
        authorized = admins.some((a) => a.email === email && a.password === password);
      } catch { /* fall through */ }
    }
    if (!authorized) {
      authorized = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    }
    if (!authorized) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("365d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("hansum_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
