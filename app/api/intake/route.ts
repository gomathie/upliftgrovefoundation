import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { intakeSchema } from "@/lib/intake";

// Confidential intake submissions — always dynamic, run on Node, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill the hidden "company" field. If it is
  // filled, silently accept and drop so spam bots get no signal. Lightweight —
  // no CAPTCHA weight on low-end devices or slow networks.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  // Re-validate on the server; browser checks are UX-only and bypassable.
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const { name, location, phone, message } = parsed.data;

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("intake_requests").insert({
      name: name && name.trim() !== "" ? name.trim() : null,
      location: location.trim(),
      phone: phone.trim(),
      message: message.trim(),
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit securely. Please try again or use the WhatsApp option." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Intake submission error:", err);
    return NextResponse.json(
      { error: "Our support system is temporarily unavailable. Please use the WhatsApp option below." },
      { status: 503 }
    );
  }
}
