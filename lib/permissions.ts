// Granular admin permissions. A user's `permissions` column is an array of
// these keys. The super-admin (env password) implicitly has all of them.

export const PERMISSIONS = [
  { key: "view_support", label: "View support requests" },
  { key: "view_contact", label: "View contact messages" },
  { key: "view_volunteer", label: "View volunteer applications" },
  { key: "view_partnership", label: "View partnership inquiries" },
  { key: "manage_status", label: "Update support request status" },
  { key: "export_data", label: "Export CSV / PDF" },
  { key: "manage_users", label: "Manage admin users" },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key) as PermissionKey[];

// Maps each dashboard tab to the permission needed to view it.
export const TAB_VIEW_PERMISSION = {
  intake: "view_support",
  contact: "view_contact",
  volunteer: "view_volunteer",
  partnership: "view_partnership",
} as const;

export function isPermissionKey(value: unknown): value is PermissionKey {
  return typeof value === "string" && ALL_PERMISSION_KEYS.includes(value as PermissionKey);
}

export function sanitizePermissions(input: unknown): PermissionKey[] {
  if (!Array.isArray(input)) return [];
  return ALL_PERMISSION_KEYS.filter((k) => input.includes(k));
}
