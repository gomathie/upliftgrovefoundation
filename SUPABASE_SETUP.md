# Supabase Setup — Confidential Intake Form

This connects the **Get Support** intake form to a private Supabase (PostgreSQL)
database. Follow these steps once to make the form live.

## 1. Create a Supabase project

1. Create a new project. **Choose the EU (Frankfurt/London) region** — this is
   the closest jurisdiction with strong data-protection law and is appropriate
   for handling data from minors. Note the database password somewhere safe.

## 2. Create the table + security policy

Open the project's **SQL Editor** and run this once:

```sql
-- Confidential youth intake submissions.
create table if not exists public.intake_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,                         -- optional / alias
  location    text not null,
  phone       text not null,
  message     text not null,
  status      text not null default 'new',  -- new | contacted | closed
  handled_by  text,                         -- counselor who responded
  handled_at  timestamptz
);

-- Lock the table down. With RLS enabled and NO policies, the public/anon key
-- can neither read nor write it. The only access is:
--   * the server route, which uses the SERVICE ROLE key (bypasses RLS), and
--   * your staff, viewing rows in the Supabase dashboard (also service role).
alter table public.intake_submissions enable row level security;
```

> **Why no policies?** The browser never touches this table directly. Writes go
> through our server route (`/api/support`) using the secret service-role key.
> Reads happen in the Supabase dashboard. Leaving the anon key with zero
> policies means a leaked public key still cannot expose a single submission.

## 3. Add your keys

In **Settings > API**, copy:

- **Project URL** → `SUPABASE_URL`
- **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`

Paste them into `.env.local` (already gitignored):

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...      # the secret one, not anon
```

Restart the dev server (`npm run dev`) so it picks up the new values.

## 4. Test it

1. Go to `/support`, fill in the form, submit.
2. In Supabase → **Table Editor → intake_submissions**, you should see the row.

## 5. Reading submissions (staff)

For now, counseling staff view and manage submissions directly in the Supabase
dashboard (Table Editor). Use the `status`, `handled_by`, and `handled_at`
columns to track follow-up.

Later, if you want an in-app staff inbox, add Supabase Auth and a read policy
scoped to authenticated counselor accounts — ask the developer to build that as
the next slice.

## Deploying to production

Set the same two env vars in your host's dashboard (Vercel / Netlify /
Cloudflare → Environment Variables). Never paste the service-role key into any
client-side code or commit it to git.

## Security checklist (already handled in code)

- [x] Writes happen server-side only (`/api/support`), never from the browser.
- [x] Service-role key is `server-only` — the build fails if it leaks to a client bundle.
- [x] Submissions are re-validated on the server (browser checks can be bypassed).
- [x] Honeypot field silently drops spam bots without heavy JS/CAPTCHA.
- [x] RLS enabled; no public read/write access to intake data.
- [ ] Confirm HTTPS in production (automatic on Vercel/Netlify/Cloudflare).
- [ ] Add a data-retention policy (how long submissions are kept) — org decision.
