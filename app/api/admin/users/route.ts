import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";
import { getSession, can } from "@/lib/session";
import { sanitizePermissions } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireManageUsers() {
  const session = await getSession();
  if (!can(session, "manage_users")) return null;
  return session;
}

// GET — list additional users.
export async function GET() {
  const session = await requireManageUsers();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, permissions, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json({ users: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load users.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — add a user { username, password, permissions }.
export async function POST(request: NextRequest) {
  const session = await requireManageUsers();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let username = "";
  let password = "";
  let permissions: string[] = [];
  try {
    const body = await request.json();
    username = typeof body?.username === "string" ? body.username.trim() : "";
    password = typeof body?.password === "string" ? body.password : "";
    permissions = sanitizePermissions(body?.permissions);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if ((process.env.ADMIN_USERNAME || "admin") === username) {
    return NextResponse.json({ error: "That username is reserved." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const password_hash = await bcrypt.hash(password, 10);
    const { error } = await supabase
      .from("admin_users")
      .insert({ username, password_hash, permissions, is_active: true });
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "That username already exists." }, { status: 409 });
      }
      throw new Error(error.message);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create user.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — update { id, permissions?, is_active?, password? }.
export async function PATCH(request: NextRequest) {
  const session = await requireManageUsers();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let id = "";
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "Missing user id." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if ("permissions" in body) update.permissions = sanitizePermissions(body.permissions);
  if ("is_active" in body) update.is_active = body.is_active === true;
  if (typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    update.password_hash = await bcrypt.hash(body.password, 10);
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("admin_users").update(update).eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update user.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE — remove a user { id }.
export async function DELETE(request: NextRequest) {
  const session = await requireManageUsers();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let id = "";
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "Missing user id." }, { status: 400 });

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete user.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
