"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
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
        <h3 className="text-2xl font-heading text-primary-navy font-bold mb-4">Message Sent!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-primary-navy font-medium hover:text-accent-gold underline"
        >
          Send another message
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
        <label className="block text-sm font-medium text-text-charcoal mb-1">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Subject</label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-charcoal mb-1">Message</label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold resize-none"
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
            Sending...
          </>
        ) : (
          "Send Inquiry"
        )}
      </button>
    </form>
  );
}
