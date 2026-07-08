"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Read the token from the URL on the client (avoids useSearchParams' prerender
  // constraints).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not reset password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-navy flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-accent-gold" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-navy">
            Choose a new password
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-gray-700 mb-4">
                Your password has been reset. Redirecting to sign in…
              </p>
              <Link href="/admin/login" className="text-primary-navy font-medium hover:text-accent-gold underline">
                Sign in now
              </Link>
            </div>
          ) : token === null ? (
            // token state is null before effect runs OR when truly absent; show
            // a gentle prompt only once we know it's missing.
            <TokenGate />
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-charcoal mb-1">
                  New password (min 8)
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  autoFocus
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-text-charcoal mb-1">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-6 py-3 bg-primary-navy text-white font-heading font-semibold rounded-md hover:bg-opacity-90 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Resetting…
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function TokenGate() {
  const [checked, setChecked] = useState(false);
  useEffect(() => setChecked(true), []);
  if (!checked) {
    return <p className="text-center text-gray-400 text-sm">Loading…</p>;
  }
  return (
    <div className="text-center">
      <p className="text-gray-700 mb-4">
        This reset link is missing or invalid. Please request a new one.
      </p>
      <Link href="/admin/forgot-password" className="text-primary-navy font-medium hover:text-accent-gold underline">
        Request a reset link
      </Link>
    </div>
  );
}
