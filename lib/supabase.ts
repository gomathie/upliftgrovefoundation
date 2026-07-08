import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client for server-side API routes.
 * Uses server-only environment variables (no NEXT_PUBLIC_ prefix) so the
 * secret key is never exposed to the browser.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local (see .env.example).'
    );
  }
  return createClient(url, key);
}
