import "server-only";
import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE } from "./auth";
import { getSupabase } from "./supabase";
import {
  ALL_PERMISSION_KEYS,
  sanitizePermissions,
  type PermissionKey,
} from "./permissions";

export interface AdminSession {
  userId: string; // "super" or the admin_users id
  username: string;
  isSuper: boolean;
  permissions: PermissionKey[];
}

// Server-side session resolver. Verifies the cookie, then — for DB users —
// re-checks the account is still active and loads fresh permissions, so
// deactivation or permission changes take effect on the next request.
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const claims = await decodeSession(token);
  if (!claims) return null;

  if (claims.isSuper) {
    return {
      userId: "super",
      username: claims.username || "admin",
      isSuper: true,
      permissions: [...ALL_PERMISSION_KEYS],
    };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("username, permissions, is_active")
      .eq("id", claims.sub)
      .single();
    if (error || !data || !data.is_active) return null;
    return {
      userId: claims.sub,
      username: data.username,
      isSuper: false,
      permissions: sanitizePermissions(data.permissions),
    };
  } catch {
    return null;
  }
}

export function can(
  session: AdminSession | null,
  permission: PermissionKey
): boolean {
  if (!session) return false;
  if (session.isSuper) return true;
  return session.permissions.includes(permission);
}
