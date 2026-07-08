"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw, Inbox, Shield } from "lucide-react";

export interface IntakeRow {
  id: string;
  created_at: string;
  name: string | null;
  location: string;
  phone: string;
  message: string;
  status: string;
  handled_by: string | null;
  handled_at: string | null;
}
export interface ContactRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}
export interface VolunteerRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  skills: string;
  message: string | null;
}
export interface PartnershipRow {
  id: string;
  created_at: string;
  organization_name: string;
  contact_person: string;
  email: string;
  partnership_idea: string | null;
}
export interface AdminData {
  intake: IntakeRow[];
  contact: ContactRow[];
  volunteer: VolunteerRow[];
  partnership: PartnershipRow[];
}

type TabKey = "intake" | "contact" | "volunteer" | "partnership";

const TABS: { key: TabKey; label: string }[] = [
  { key: "intake", label: "Support Requests" },
  { key: "contact", label: "Contact" },
  { key: "volunteer", label: "Volunteers" },
  { key: "partnership", label: "Partnerships" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
};

export function AdminDashboard({
  data,
  loadError,
}: {
  data: AdminData;
  loadError: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("intake");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const counts = {
    intake: data.intake.length,
    contact: data.contact.length,
    volunteer: data.volunteer.length,
    partnership: data.partnership.length,
  };
  const newIntake = data.intake.filter((r) => r.status === "pending").length;

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/intake-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-primary-navy text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-gold" />
            <span className="font-heading font-bold text-lg">UpliftGrove Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={logout}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-accent-gold text-primary-navy font-semibold hover:bg-opacity-90 transition-opacity disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            Could not load submissions: {loadError}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Support Requests" value={counts.intake} highlight={`${newIntake} new`} />
          <SummaryCard label="Contact Messages" value={counts.contact} />
          <SummaryCard label="Volunteers" value={counts.volunteer} />
          <SummaryCard label="Partnerships" value={counts.partnership} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? "border-accent-gold text-primary-navy"
                  : "border-transparent text-gray-500 hover:text-primary-navy"
              }`}
            >
              {t.label}{" "}
              <span className="ml-1 text-xs text-gray-400">({counts[t.key]})</span>
            </button>
          ))}
        </div>

        {/* Tables */}
        {tab === "intake" && (
          <IntakeTable
            rows={data.intake}
            onStatus={updateStatus}
            updatingId={updatingId}
          />
        )}
        {tab === "contact" && <ContactTable rows={data.contact} />}
        {tab === "volunteer" && <VolunteerTable rows={data.volunteer} />}
        {tab === "partnership" && <PartnershipTable rows={data.partnership} />}
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-heading font-bold text-primary-navy mt-1">{value}</p>
      {highlight && <p className="text-xs text-accent-gold font-medium mt-1">{highlight}</p>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <Inbox className="w-10 h-10 mx-auto mb-3" />
      <p>No submissions yet.</p>
    </div>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

const th = "text-left font-semibold text-gray-600 px-4 py-3 whitespace-nowrap";
const td = "px-4 py-3 align-top border-t border-gray-100";

function IntakeTable({
  rows,
  onStatus,
  updatingId,
}: {
  rows: IntakeRow[];
  onStatus: (id: string, status: string) => void;
  updatingId: string | null;
}) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <TableShell>
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Name / Alias</th>
          <th className={th}>Location</th>
          <th className={th}>Phone / WhatsApp</th>
          <th className={th}>Message</th>
          <th className={th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={`${td} whitespace-nowrap text-gray-500`}>{fmtDate(r.created_at)}</td>
            <td className={td}>{r.name || <span className="text-gray-400">—</span>}</td>
            <td className={td}>{r.location}</td>
            <td className={`${td} whitespace-nowrap`}>
              <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary-navy underline hover:text-accent-gold">
                {r.phone}
              </a>
            </td>
            <td className={`${td} max-w-md whitespace-pre-wrap break-words`}>{r.message}</td>
            <td className={td}>
              <select
                value={r.status}
                disabled={updatingId === r.id}
                onChange={(e) => onStatus(r.id, e.target.value)}
                className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer disabled:opacity-50 ${
                  statusStyles[r.status] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function ContactTable({ rows }: { rows: ContactRow[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <TableShell>
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Name</th>
          <th className={th}>Email</th>
          <th className={th}>Subject</th>
          <th className={th}>Message</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={`${td} whitespace-nowrap text-gray-500`}>{fmtDate(r.created_at)}</td>
            <td className={td}>{r.name}</td>
            <td className={`${td} whitespace-nowrap`}>
              <a href={`mailto:${r.email}`} className="text-primary-navy underline hover:text-accent-gold">{r.email}</a>
            </td>
            <td className={td}>{r.subject}</td>
            <td className={`${td} max-w-md whitespace-pre-wrap break-words`}>{r.message}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function VolunteerTable({ rows }: { rows: VolunteerRow[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <TableShell>
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Full Name</th>
          <th className={th}>Email</th>
          <th className={th}>Skills / Interest</th>
          <th className={th}>Message</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={`${td} whitespace-nowrap text-gray-500`}>{fmtDate(r.created_at)}</td>
            <td className={td}>{r.full_name}</td>
            <td className={`${td} whitespace-nowrap`}>
              <a href={`mailto:${r.email}`} className="text-primary-navy underline hover:text-accent-gold">{r.email}</a>
            </td>
            <td className={td}>{r.skills}</td>
            <td className={`${td} max-w-md whitespace-pre-wrap break-words`}>{r.message || <span className="text-gray-400">—</span>}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function PartnershipTable({ rows }: { rows: PartnershipRow[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <TableShell>
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Organization</th>
          <th className={th}>Contact Person</th>
          <th className={th}>Email</th>
          <th className={th}>Idea</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={`${td} whitespace-nowrap text-gray-500`}>{fmtDate(r.created_at)}</td>
            <td className={td}>{r.organization_name}</td>
            <td className={td}>{r.contact_person}</td>
            <td className={`${td} whitespace-nowrap`}>
              <a href={`mailto:${r.email}`} className="text-primary-navy underline hover:text-accent-gold">{r.email}</a>
            </td>
            <td className={`${td} max-w-md whitespace-pre-wrap break-words`}>{r.partnership_idea || <span className="text-gray-400">—</span>}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
