# Admin Panel

A password-protected area at **`/admin`** where staff review every form
submission (Support / Contact / Volunteer / Partnership) and track follow-up on
support requests.

## How it works

- **One shared admin password** (`ADMIN_PASSWORD`) is exchanged at
  `/admin/login` for a short-lived (8h) signed session cookie.
- The cookie is **httpOnly** and signed with `ADMIN_SESSION_SECRET` (via `jose`).
- **Middleware** (`middleware.ts`) gates every `/admin` page and `/api/admin`
  route — no valid session means pages redirect to login and API calls get 401.
- The dashboard reads submissions **server-side with the Supabase secret key**,
  so the browser never touches the database and RLS stays fully locked.

## Setup

1. In `.env.local`, set a strong `ADMIN_PASSWORD`. `ADMIN_SESSION_SECRET` is
   already generated for you (keep it private). To regenerate the secret:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
2. Restart the dev server (`npm run dev`).
3. Go to **http://localhost:3000/admin**, enter the password, and you're in.

## Using it

- **Summary cards** show totals per form type, plus how many support requests
  are still "new" (pending).
- **Tabs** switch between the four submission types, newest first.
- **Support Requests** have a status dropdown — set each to **Pending →
  Contacted → Closed** as you follow up. This records `handled_at` automatically.
  Phone numbers link straight to WhatsApp; emails are click-to-mail.
- **Log out** clears the session immediately.

## Production

Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in your host's environment
variables (Vercel / Netlify / Cloudflare), alongside `SUPABASE_URL` and
`SUPABASE_SECRET_KEY`. The admin pages are marked `noindex` so search engines
won't list them.

## Upgrading later (optional)

This is intentionally simple (one shared password). If you later need multiple
named staff accounts with individual logins and audit trails, switch to Supabase
Auth — ask the developer to build that as the next slice.
