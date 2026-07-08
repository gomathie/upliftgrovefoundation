import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { intakeSchema } from "@/lib/intake";
import { notifyNewSupportRequest } from "@/lib/mail";
import { sendSms } from "@/lib/sms";

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
    
    // Insert record first to ensure it's saved. Select 'id' to update it later with campaign IDs.
    const { data: dbData, error } = await supabase
      .from("intake_requests")
      .insert({
        name: name && name.trim() !== "" ? name.trim() : null,
        location: location.trim(),
        phone: phone.trim(),
        message: message.trim(),
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit securely. Please try again or use the WhatsApp option." },
        { status: 500 }
      );
    }

    const insertedId = dbData?.id;

    // Send SMS notifications if MNOTIFY_API_KEY is configured
    let smsUserCampaignId = null;
    let smsCounselorCampaignId = null;

    if (process.env.MNOTIFY_API_KEY) {
      // 1. Send confirmation SMS to user
      try {
        const userMsg = "Thank you for reaching out to UpliftGrove. We received your message and a counselor will contact you soon. You are safe with us.";
        const userRes = await sendSms(phone.trim(), userMsg);
        smsUserCampaignId = userRes.summary?._id || null;
      } catch (smsErr) {
        console.error("Failed to send user confirmation SMS:", smsErr);
      }

      // 2. Send alert SMS to counselor
      const counselorPhone = process.env.COUNSELOR_PHONE;
      if (counselorPhone) {
        try {
          const alertMsg = "New UpliftGrove intake received. Please check the dashboard and respond.";
          const counselorRes = await sendSms(counselorPhone.trim(), alertMsg);
          smsCounselorCampaignId = counselorRes.summary?._id || null;
        } catch (smsErr) {
          console.error("Failed to send counselor alert SMS:", smsErr);
        }
      }

      // 3. Update database record with the campaign IDs
      if (insertedId && (smsUserCampaignId || smsCounselorCampaignId)) {
        const { error: updateError } = await supabase
          .from("intake_requests")
          .update({
            sms_user_campaign_id: smsUserCampaignId,
            sms_counselor_campaign_id: smsCounselorCampaignId,
          })
          .eq("id", insertedId);
        
        if (updateError) {
          console.warn("Could not save SMS campaign IDs (possibly columns are missing in DB):", updateError.message);
        }
      }
    }

    // Notify staff by email (best-effort; a mail failure must never fail the
    // submission). Privacy-respecting: no phone/message content in the email.
    try {
      const proto = request.headers.get("x-forwarded-proto") ?? "http";
      const host =
        request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        "localhost:3000";
      await notifyNewSupportRequest({
        location: location.trim(),
        hasAlias: !!(name && name.trim() !== ""),
        receivedAt: new Date().toISOString(),
        adminUrl: `${proto}://${host}/admin`,
      });
    } catch (mailErr) {
      console.error("Notification email failed:", mailErr);
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
