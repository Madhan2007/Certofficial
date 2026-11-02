import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminKey = process.env.ADMIN_ACCESS_KEY?.trim();

    if (!adminKey) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_ACCESS_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (!key || key !== adminKey) {
      return NextResponse.json({ ok: false, error: "Invalid admin access key." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: adminKey,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Authentication failed." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
