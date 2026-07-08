# Supabase Setup — Form Submissions

The site's four forms (Get Support intake, Contact, Volunteer, Partnership)
save to a private Supabase (PostgreSQL) database via server-side API routes.
Follow these steps once to make them live.

## 1. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) (the free tier is enough).
2. Create a new project. **Choose the EU (Frankfurt/London) region** — the
   closest jurisdiction with strong data-protection law, appropriate for
   handling data from minors. Save the database password somewhere safe.

## 2. Create the tables + security policies

Open the project's **SQL Editor** and run this once:

```sql
-- 1. Confidential youth intake (most sensitive).
create table if not exists public.intake_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,                            -- optional / alias
  location    text not null,
  phone       text not null,
  message     text not null,
  status      text not null default 'pending', -- pending | contacted | closed
  handled_by  text,
  handled_at  timestamptz
);

-- 2. General contact messages.
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null
);

-- 3. Volunteer applications.
create table if not exists public.volunteer_applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  email       text not null,
  skills      text not null,
  message     text
);

-- 4. Partnership inquiries.
create table if not exists public.partnership_inquiries (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  organization_name text not null,
  contact_person    text not null,
  email             text not null,
  partnership_idea  text
);

-- Lock every table down. With RLS enabled and NO policies, the public/anon key
-- can neither read nor write. The only access is:
--   * the server routes, which use the SERVICE ROLE key (bypasses RLS), and
--   * your staff, viewing rows in the Supabase dashboard (also service role).
alter table public.intake_requests        enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.volunteer_applications enable row level security;
alter table public.partnership_inquiries  enable row level security;
```

> **Why no policies?** The browser never touches these tables directly. Writes
> go through the server routes (`/api/intake`, `/api/contact`, `/api/volunteer`,
> `/api/partnership`) using the secret service-role key. Reads happen in the
> Supabase dashboard. Zero policies means a leaked public key still cannot
> expose a single submission — the strongest default for youth data.

## 3. Add your keys

In **Settings > API**, copy:

- **Project URL** → `SUPABASE_URL`
- **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`  (the secret one, **not** anon)

Paste them into `.env.local` (already gitignored):

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

Restart the dev server (`npm run dev`) so it picks up the new values.

## 4. Test it

1. Go to `/support`, fill in the intake form, submit.
2. In Supabase → **Table Editor → intake_requests**, you should see the row.
3. Repeat for the Contact and Get Involved forms once those are wired up.

## 5. Reading submissions (staff)

For now, staff view and manage submissions directly in the Supabase dashboard
(Table Editor). On `intake_requests`, use `status`, `handled_by`, and
`handled_at` to track follow-up. Later, an in-app staff inbox can be added with
Supabase Auth + a read policy scoped to counselor accounts.

## Deploying to production

Set the same two env vars in your host's dashboard (Vercel / Netlify /
Cloudflare → Environment Variables). Never put the service-role key into any
client-side code or commit it to git.

## Security checklist

- [x] Writes happen server-side only; never from the browser.
- [x] Service-role key is `server-only` — the build fails if it leaks to a client bundle.
- [x] Submissions are re-validated on the server (browser checks can be bypassed).
- [x] Intake form has a honeypot that silently drops spam bots (no heavy CAPTCHA).
- [x] RLS enabled with no public read/write access.
- [ ] Confirm HTTPS in production (automatic on Vercel/Netlify/Cloudflare).
- [ ] Wire the Contact / Volunteer / Partnership forms to their routes (intake is done).
- [ ] Decide a data-retention policy for intake submissions (org decision).
```
