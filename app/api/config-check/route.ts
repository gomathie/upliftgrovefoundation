import { NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC — reports whether admin env vars are present in the
// running deployment (booleans only, no secret values). DELETE THIS FILE once
// the deployment login is confirmed working.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    vercel_env: process.env.VERCEL_ENV || null, // production | preview | development
    node_env: process.env.NODE_ENV,
    ADMIN_USERNAME_set: !!process.env.ADMIN_USERNAME,
    resolved_owner_username: process.env.ADMIN_USERNAME || "admin (fallback — ADMIN_USERNAME not set)",
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_length: (process.env.ADMIN_PASSWORD || "").length,
    ADMIN_SESSION_SECRET_set: !!process.env.ADMIN_SESSION_SECRET,
    ADMIN_SESSION_SECRET_length: (process.env.ADMIN_SESSION_SECRET || "").length,
    SUPABASE_URL_set: !!process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY_set: !!process.env.SUPABASE_SECRET_KEY,
  });
}
