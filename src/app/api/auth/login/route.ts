import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hansum-jwt-secret-key-change-in-production"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ADMIN_EMAILS: comma-separated list of allowed emails, all share ADMIN_PASSWORD
    const allowedEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
      .split(",").map((e) => e.trim().toLowerCase());
    const validEmail = allowedEmails.includes(email.toLowerCase());
    const validPassword = password === process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
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
