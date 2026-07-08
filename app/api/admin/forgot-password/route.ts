import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESET_TTL_MINUTES = 60;

// Always returns a generic success so this endpoint never reveals whether an
// email is registered. If the email matches an active user, we store a hashed
// reset token and email them a link.
export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const generic = NextResponse.json({
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  });

  if (!email) return generic;

  try {
    const supabase = getSupabase();
    const { data: user } = await supabase
      .from("admin_users")
      .select("id, email, is_active")
      .eq("email", email)
      .single();

    if (!user || !user.is_active || !user.email) return generic;

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000).toISOString();

    await supabase
      .from("admin_users")
      .update({ reset_token_hash: tokenHash, reset_token_expires: expires })
      .eq("id", user.id);

    const proto = request.headers.get("x-forwarded-proto") ?? "http";
    const host =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      "localhost:3000";
    const resetUrl = `${proto}://${host}/admin/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    // Never leak details; still return generic success.
    console.error("Forgot-password error:", err);
  }

  return generic;
}
