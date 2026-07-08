import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { getSession, can } from "@/lib/session";
import { AdminDashboard, type AdminData } from "@/components/admin/AdminDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function emptyData(): AdminData {
  return { intake: [], contact: [], volunteer: [], partnership: [] };
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const data = emptyData();
  let loadError: string | null = null;

  try {
    const supabase = getSupabase();
    // Only query tables this user is allowed to view.
    const tasks: PromiseLike<void>[] = [];
    if (can(session, "view_support")) {
      tasks.push(
        supabase.from("intake_requests").select("*").order("created_at", { ascending: false }).then(({ data: d, error }) => {
          if (error) throw new Error(error.message);
          data.intake = d ?? [];
        })
      );
    }
    if (can(session, "view_contact")) {
      tasks.push(
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data: d, error }) => {
          if (error) throw new Error(error.message);
          data.contact = d ?? [];
        })
      );
    }
    if (can(session, "view_volunteer")) {
      tasks.push(
        supabase.from("volunteer_applications").select("*").order("created_at", { ascending: false }).then(({ data: d, error }) => {
          if (error) throw new Error(error.message);
          data.volunteer = d ?? [];
        })
      );
    }
    if (can(session, "view_partnership")) {
      tasks.push(
        supabase.from("partnership_inquiries").select("*").order("created_at", { ascending: false }).then(({ data: d, error }) => {
          if (error) throw new Error(error.message);
          data.partnership = d ?? [];
        })
      );
    }
    await Promise.all(tasks);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load submissions.";
  }

  return (
    <AdminDashboard
      data={data}
      loadError={loadError}
      session={{
        username: session.username,
        isSuper: session.isSuper,
        permissions: session.permissions,
      }}
    />
  );
}
