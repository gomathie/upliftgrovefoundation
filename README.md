# upliftgrovefoundation

Providing Humanitarian aid, Promoting Human Rights, Conducting Research, and advocacy, Implementing developement projects, providing health Services, Couselling Services, Providing education services to help the needy, Youth advocacy and Engaging in Music therapy.

## Health check endpoint

A lightweight health check is available at `/api/health` for uptime monitoring and deployment verification.

### What it checks

- Verifies the Next.js app is responding
- Performs a read-only Supabase query against the existing `admin_users` table
- Returns a JSON payload with `status`, `database`, and `timestamp`

### Required environment variables

Make sure the Vercel deployment has these server-side variables configured:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

### Vercel Cron

The project includes a Vercel Cron configuration in `vercel.json` to call `/api/health` every 6 hours.
