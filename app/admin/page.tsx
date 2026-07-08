import { getSupabase } from "@/lib/supabase";
import { AdminDashboard, type AdminData } from "@/components/admin/AdminDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadData(): Promise<{ data: AdminData; error: string | null }> {
  try {
    const supabase = getSupabase();
    const [intake, contact, volunteer, partnership] = await Promise.all([
      supabase.from("intake_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("partnership_inquiries").select("*").order("created_at", { ascending: false }),
    ]);

    const firstError =
      intake.error || contact.error || volunteer.error || partnership.error;
    if (firstError) {
      return { data: emptyData(), error: firstError.message };
    }

    return {
      data: {
        intake: intake.data ?? [],
        contact: contact.data ?? [],
        volunteer: volunteer.data ?? [],
        partnership: partnership.data ?? [],
      },
      error: null,
    };
  } catch (err) {
    return {
      data: emptyData(),
      error: err instanceof Error ? err.message : "Failed to load data.",
    };
  }
}

function emptyData(): AdminData {
  return { intake: [], contact: [], volunteer: [], partnership: [] };
}

export default async function AdminPage() {
  const { data, error } = await loadData();
  return <AdminDashboard data={data} loadError={error} />;
}
