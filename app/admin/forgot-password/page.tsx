"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show the same confirmation (don't reveal whether the email exists).
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-navy flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-accent-gold" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-navy">
            Reset password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            We&apos;ll email you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                If that email is registered to an admin account, a password reset
                link is on its way. The link is valid for 1 hour.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-primary-navy font-medium hover:text-accent-gold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-charcoal mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
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
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Sending…
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
              <div className="text-center">
                <Link href="/admin/login" className="text-sm text-gray-500 hover:text-primary-navy">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
