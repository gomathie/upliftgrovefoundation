import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, safeEqual, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const superUsername = process.env.ADMIN_USERNAME || "admin";

  if (!sessionSecret) {
    return NextResponse.json(
      { error: "Admin login is not configured (ADMIN_SESSION_SECRET missing)." },
      { status: 500 }
    );
  }

  let username = "";
  let password = "";
  try {
    const body = await request.json();
    username = typeof body?.username === "string" ? body.username.trim() : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Enter a username and password." }, { status: 400 });
  }

  // 1) Owner / super-admin via env password.
  if (username === superUsername) {
    if (adminPassword && safeEqual(password, adminPassword)) {
      const token = await createSessionToken({
        sub: "super",
        username: superUsername,
        isSuper: true,
      });
      const res = NextResponse.json({ success: true });
      sessionCookie(res, token);
      return res;
    }
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  // 2) Additional user from the admin_users table.
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, is_active")
      .eq("username", username)
      .single();

    if (error || !data || !data.is_active) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, data.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    const token = await createSessionToken({
      sub: data.id,
      username: data.username,
      isSuper: false,
    });
    const res = NextResponse.json({ success: true });
    sessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }
}
