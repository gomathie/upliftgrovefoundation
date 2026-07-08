# Admin Panel

A password-protected area at **`/admin`** where staff review every form
submission (Support / Contact / Volunteer / Partnership), track follow-up on
support requests, export data, and (for the owner) manage additional users.

## Accounts & permissions

There are two kinds of login:

- **Owner / super-admin** — logs in with username `admin` (or `ADMIN_USERNAME`)
  and the `ADMIN_PASSWORD` from the environment. Always has every permission,
  including user management. Cannot be locked out or deleted.
- **Additional users** — created by the owner in **Admin → Users**, stored in
  the `admin_users` table with hashed (bcrypt) passwords and a specific set of
  permissions.

Permissions (assigned per user):

| Permission | Grants |
|---|---|
| View support requests | See the Support Requests tab |
| View contact messages | See the Contact tab |
| View volunteer applications | See the Volunteers tab |
| View partnership inquiries | See the Partnerships tab |
| Update support request status | Change Pending → Contacted → Closed |
| Export CSV / PDF | Use the export buttons |
| Manage admin users | Add/edit/remove users and assign permissions |

Enforcement is **server-side**: the dashboard only queries tables a user may
view, and the status/user APIs re-check permissions on every call. The UI also
hides anything the user can't access. Deactivating a user or changing their
permissions takes effect on their **next request** (no need to wait for their
session to expire).

## Setup

### 1. Environment (`.env.local`)

```
ADMIN_PASSWORD=<a strong owner password>
ADMIN_SESSION_SECRET=<already generated for you>
# ADMIN_USERNAME=admin   # optional; defaults to "admin"
```

### 2. Users table (only needed for additional users)

The owner login works without this. To enable additional users, run this once
in the Supabase **SQL Editor**:

```sql
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  username      text unique not null,
  password_hash text not null,
  permissions   text[] not null default '{}',
  is_active     boolean not null default true
);
alter table public.admin_users enable row level security;
```

> RLS with no policies = the table is only reachable via the server (secret
> key). Passwords are stored as bcrypt hashes, never plaintext.

### 3. Use it

1. Restart the dev server (`npm run dev`).
2. Go to **http://localhost:3000/admin**, log in as the owner.
3. To add staff: **Users** (top-right) → fill username, password, tick the
   permissions → **Add user**. They can now log in at `/admin` with those rights.

## Dashboard features

- **Summary cards** and **tabs** per submission type (only the ones you may view).
- **Support Requests**: status dropdown (Pending / Contacted / Closed), records
  `handled_at`; phone links to WhatsApp, emails are click-to-mail.
- **Export**: CSV (opens in Excel) and PDF (branded, landscape) of the current tab.

## Production

Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (and optionally `ADMIN_USERNAME`)
in your host's environment variables, alongside the Supabase ones. Admin pages
are `noindex`.
