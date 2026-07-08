"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Trash2, Loader2, Shield } from "lucide-react";
import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";

export interface AdminUserRow {
  id: string;
  username: string;
  permissions: PermissionKey[];
  is_active: boolean;
  created_at: string;
}

const TABLE_SQL = `create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  username      text unique not null,
  password_hash text not null,
  permissions   text[] not null default '{}',
  is_active     boolean not null default true
);
alter table public.admin_users enable row level security;`;

export function AdminUsers({
  initialUsers,
  loadError,
  tableMissing,
}: {
  initialUsers: AdminUserRow[];
  loadError: string | null;
  tableMissing: boolean;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add-user form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPerms, setNewPerms] = useState<PermissionKey[]>([
    "view_support",
    "manage_status",
  ]);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  function toggleNewPerm(key: PermissionKey) {
    setNewPerms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, permissions: newPerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Could not add user.");
        return;
      }
      setUsername("");
      setPassword("");
      setNewPerms(["view_support", "manage_status"]);
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Remove user "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  function toggleUserPerm(user: AdminUserRow, key: PermissionKey) {
    const next = user.permissions.includes(key)
      ? user.permissions.filter((p) => p !== key)
      : [...user.permissions, key];
    patchUser(user.id, { permissions: next });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-full">
      <header className="bg-primary-navy text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-gold" />
            <span className="font-heading font-bold text-lg">Manage Users</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to dashboard
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-accent-gold text-primary-navy font-semibold hover:bg-opacity-90"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {tableMissing && (
          <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-900">
            <p className="font-semibold mb-2">One-time setup needed</p>
            <p className="mb-3">
              Run this in your Supabase <strong>SQL Editor</strong> to create the
              users table, then refresh this page:
            </p>
            <pre className="bg-white/70 border border-yellow-200 rounded-md p-3 overflow-x-auto text-xs text-gray-800 whitespace-pre">
              {TABLE_SQL}
            </pre>
          </div>
        )}
        {loadError && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {loadError}
          </div>
        )}

        {/* Add user */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-semibold text-primary-navy text-lg mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add a user
          </h2>
          <form onSubmit={addUser} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-charcoal mb-1">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  autoComplete="off"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-charcoal mb-1">Password (min 8)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                />
              </div>
            </div>
            <div>
              <p className="block text-sm font-medium text-text-charcoal mb-2">Permissions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PERMISSIONS.map((p) => (
                  <label key={p.key} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={newPerms.includes(p.key)}
                      onChange={() => toggleNewPerm(p.key)}
                      className="rounded border-gray-300 text-primary-navy focus:ring-accent-gold"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-navy text-white font-heading font-semibold rounded-md hover:bg-opacity-90 disabled:opacity-60"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Add user
            </button>
          </form>
        </section>

        {/* Existing users */}
        <section>
          <h2 className="font-heading font-semibold text-primary-navy text-lg mb-4">
            Users ({initialUsers.length})
          </h2>
          {initialUsers.length === 0 ? (
            <p className="text-gray-400 text-sm">No additional users yet.</p>
          ) : (
            <div className="space-y-4">
              {initialUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-primary-navy">{u.username}</p>
                      <p className="text-xs text-gray-400">
                        Added {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={u.is_active}
                          disabled={busyId === u.id}
                          onChange={(e) => patchUser(u.id, { is_active: e.target.checked })}
                          className="rounded border-gray-300 text-primary-navy focus:ring-accent-gold"
                        />
                        Active
                      </label>
                      <button
                        onClick={() => deleteUser(u.id, u.username)}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PERMISSIONS.map((p) => (
                      <label key={p.key} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={u.permissions.includes(p.key)}
                          disabled={busyId === u.id}
                          onChange={() => toggleUserPerm(u, p.key)}
                          className="rounded border-gray-300 text-primary-navy focus:ring-accent-gold"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
