import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let token = "";
  let password = "";
  try {
    const body = await request.json();
    token = typeof body?.token === "string" ? body.token : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const supabase = getSupabase();
    const { data: user } = await supabase
      .from("admin_users")
      .select("id, reset_token_expires, is_active")
      .eq("reset_token_hash", tokenHash)
      .single();

    if (
      !user ||
      !user.is_active ||
      !user.reset_token_expires ||
      new Date(user.reset_token_expires).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { error } = await supabase
      .from("admin_users")
      .update({
        password_hash,
        reset_token_hash: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Reset-password update error:", error.message);
      return NextResponse.json({ error: "Could not reset password. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset-password error:", err);
    return NextResponse.json({ error: "Could not reset password. Please try again." }, { status: 500 });
  }
}
