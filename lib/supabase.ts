import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the SERVICE ROLE key.
//
// Every form submission is written from a server route, so we use the
// service-role key here rather than the public anon key. This lets us keep
// Row-Level Security in "deny all" mode (see SUPABASE_SETUP.md) — even a
// leaked anon key then cannot read a single submission. The `server-only`
// import makes the build fail if this module is ever pulled into the browser.
//
// Built lazily so a missing env var surfaces as a handled request error
// instead of crashing at import time.
export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  // New Supabase key name (sb_secret_...); falls back to the legacy
  // service_role env name if that's what's set.
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local"
    );
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
