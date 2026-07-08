import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSession, can } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = ["pending", "contacted", "closed"] as const;
type Status = (typeof ALLOWED)[number];

// Protected by middleware (/api/admin/*). Requires the manage_status permission.
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!can(session, "manage_status")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let id = "";
  let status = "";
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
    status = typeof body?.status === "string" ? body.status : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!id || !ALLOWED.includes(status as Status)) {
    return NextResponse.json({ error: "Invalid id or status." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("intake_requests")
      .update({
        status,
        handled_by: "admin",
        handled_at: status === "pending" ? null : new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Status update error:", error.message);
      return NextResponse.json({ error: "Could not update status." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
