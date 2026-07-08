import { SignJWT, jwtVerify } from "jose";

// Simple single-admin auth: one shared password (ADMIN_PASSWORD) exchanged for
// a short-lived signed session token stored in an httpOnly cookie. Kept
// deliberately lightweight — no user table, no Supabase Auth — appropriate for
// a single admin. Edge-compatible (jose) so it works in middleware.

export const SESSION_COOKIE = "ug_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function getSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set (min 16 chars).");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// Constant-time-ish string comparison to avoid trivial timing leaks on the
// password check. (Length is not hidden, which is an acceptable tradeoff here.)
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
