"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("Counseling / Mental Health Professional");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          skills,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
      setFullName("");
      setEmail("");
      setSkills("Counseling / Mental Health Professional");
      setMessage("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-heading text-primary-navy font-bold mb-4">Application Received!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your interest in volunteering. We'll be in touch soon.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-primary-navy font-medium hover:text-accent-gold underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Full Name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Skills / Interests</label>
        <select
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        >
          <option>Counseling / Mental Health Professional</option>
          <option>Mentorship</option>
          <option>Event Organization</option>
          <option>Admin / Operational Support</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Message</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold resize-none"
          placeholder="Tell us a bit about why you want to volunteer..."
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center px-6 py-3 bg-primary-navy text-white font-heading font-semibold rounded-md hover:bg-opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Submitting...
          </>
        ) : (
          "Submit Volunteer Application"
        )}
      </button>
    </form>
  );
}
