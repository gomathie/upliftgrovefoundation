"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { intakeSchema, type IntakeFormData } from "@/lib/intake";

export function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Honeypot field, kept outside react-hook-form so it is never validated or
  // shown to real users. Bots that auto-fill every input will trip it.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
  });

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          company: honeypotRef.current?.value ?? "",
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload.error ||
            "Something went wrong securely submitting your request. Please try again or use the WhatsApp option."
        );
      }

      setIsSuccess(true);
      reset();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong securely submitting your request. Please try again or use the WhatsApp option."
      );
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
        <h3 className="text-2xl font-heading text-primary-navy font-bold mb-4">Message Received</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out. A professional counselor will contact you shortly. Remember, you are not alone.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-primary-navy font-medium hover:text-accent-gold underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Honeypot: hidden from users, catches spam bots. Do not remove. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company (leave this blank)</label>
        <input
          id="company"
          type="text"
          ref={honeypotRef}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-charcoal mb-1">
          Name or Alias (Optional)
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          placeholder="You can use a nickname if you prefer"
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-text-charcoal mb-1">
          General Location / Region <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          placeholder="e.g., Accra, Kumasi, Tamale"
          className={`w-full px-4 py-3 rounded-md border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-shadow`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-charcoal mb-1">
          Phone Number / WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="How can we reach you?"
          className={`w-full px-4 py-3 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-shadow`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-charcoal mb-1">
          What is on your mind? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          placeholder="Please share briefly what you are going through. This is completely confidential."
          className={`w-full px-4 py-3 rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-shadow resize-none`}
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center px-8 py-4 bg-accent-gold text-primary-navy font-heading font-bold rounded-md hover:bg-opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-navy" />
            Sending securely...
          </>
        ) : (
          "Send Message to Counselor"
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-2">Prefer to use WhatsApp directly?</p>
        <a
          href="https://wa.me/233508133939"
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-navy font-medium hover:text-accent-gold transition-colors"
        >
          Message us on WhatsApp
        </a>
      </div>
    </form>
  );
}
