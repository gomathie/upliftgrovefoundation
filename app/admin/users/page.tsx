import { redirect } from "next/navigation";
import { getSession, can } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { AdminUsers, type AdminUserRow } from "@/components/admin/AdminUsers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session, "manage_users")) redirect("/admin");

  let users: AdminUserRow[] = [];
  let loadError: string | null = null;
  let tableMissing = false;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, permissions, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      if (error.code === "42P01" || error.message.includes("schema cache")) {
        tableMissing = true;
      } else {
        loadError = error.message;
      }
    } else {
      users = (data as AdminUserRow[]) ?? [];
    }
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load users.";
  }

  return (
    <AdminUsers
      initialUsers={users}
      loadError={loadError}
      tableMissing={tableMissing}
    />
  );
}
