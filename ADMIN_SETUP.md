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

## Email notifications (new support requests)

When a new support request is submitted, staff are alerted by email (best-effort
— a mail failure never blocks the submission).

**Privacy by design:** the email contains only the time, general location, and
whether an alias was given — **never the phone number or message**. Those stay
in the restricted database; the email just says "log in to review." This follows
the rule that confidential intake data must not live in an inbox.

Configure SMTP in `.env.local` (or your host's env in production):

```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587            # 587 (STARTTLS) or 465 (implicit TLS)
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=alerts@yourdomain.org
SMTP_TO_EMAIL=team@yourdomain.org   # where alerts are delivered
```

If SMTP is not fully set, notifications are simply skipped (logged, not errored).

## Password reset (self-service)

Each additional user has an **email**. If they forget their password:

1. On `/admin/login` they click **Forgot password?**
2. They enter their email; if it matches an active account, a reset link
   (valid **1 hour**) is emailed to them.
3. The link opens `/admin/reset-password`, where they set a new password.

Reset emails use the same **SMTP** settings as the support-request
notifications — they only send once SMTP is fully configured. The owner
(env password) does not use this flow.

**If you created `admin_users` before this feature**, add the new columns:

```sql
alter table public.admin_users
  add column if not exists email text unique,
  add column if not exists reset_token_hash text,
  add column if not exists reset_token_expires timestamptz;
```

Security notes: the "forgot" endpoint always returns the same response (it never
reveals whether an email is registered). Reset tokens are stored **hashed**
(SHA-256), are single-use, and expire after an hour.
