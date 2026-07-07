# UpliftGrove Foundation — Website Documentation

**Version 1.0 | July 2026**
**Purpose:** Full specification for design, content, and development of the UpliftGrove Foundation website — a nonprofit platform supporting Ghanaian youth through counseling, guidance, and community programs.

> **Note on scope:** This documentation is built from the brand guidelines and developer notes provided. Where organization-specific details (exact program names, staff bios, legal registration info, donation processor) were not supplied, this doc flags them as **[NEEDS INPUT]** so your team can fill them in before launch.

---

## 1. Project Overview

| Item | Detail |
|---|---|
| Organization | UpliftGrove Foundation |
| Sector | Nonprofit — youth counseling, guidance & community support (Ghana) |
| Primary audiences | (1) Youth seeking support/counseling, (2) Donors/international supporters, (3) Volunteers, (4) Local community/parents |
| Core goals | Provide a safe, confidential intake channel for youth in crisis; build trust and credibility with donors; showcase programs and impact; recruit volunteers |
| Key constraint | Majority of local traffic on mobile data (MTN, Telecel, AirtelTigo) — performance and low-bandwidth design are priorities |

---

## 2. Brand System

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-navy` | `#1A2E40` | Headings, primary text on light backgrounds, nav bar, footer |
| `--color-accent-gold` | `#E5A93C` | CTAs, buttons, highlights, active states |
| `--color-bg-warm-sand` | `#F9F8F6` | Page background |
| `--color-text-charcoal` | `#2D3142` | Body copy |
| `--color-white` | `#FFFFFF` | Text on dark/image overlays, card backgrounds |

**Critical accessibility rule:** Any element using Gold (`#E5A93C`) as a background **must** use dark text (Navy `#1A2E40` or Charcoal `#2D3142`). White text on gold is prohibited — it fails WCAG contrast.

### 2.2 Typography

| Role | Font | Fallback |
|---|---|---|
| Headings (h1–h3) | Montserrat | sans-serif |
| Body copy | Inter | sans-serif |

### 2.3 CSS Foundation

```css
:root {
  --color-primary-navy: #1A2E40;
  --color-accent-gold: #E5A93C;
  --color-bg-warm-sand: #F9F8F6;
  --color-text-charcoal: #2D3142;
  --color-white: #FFFFFF;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
}

body {
  background-color: var(--color-bg-warm-sand);
  color: var(--color-text-charcoal);
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  color: var(--color-primary-navy);
}

.cta-button {
  background-color: var(--color-accent-gold);
  color: var(--color-primary-navy);
  font-family: var(--font-heading);
  font-weight: 600;
}
```

### 2.4 Visual/Photography Guidelines

- Use high-quality, lightweight, compressed images (`.webp`) of local Ghanaian children in a positive, dignified, hopeful light.
- **Avoid** "poverty tourism" tropes (e.g., staged distress, exploitative close-ups). Favor images showing agency, joy, learning, and community.
- Hero text overlay: white text over a dark image overlay, **or** Navy text over a clean Warm Sand background — never low-contrast combinations.

---

## 3. Site Architecture / Sitemap

```
Home
├── About Us
│   ├── Our Story / Mission [NEEDS INPUT]
│   ├── Team & Board [NEEDS INPUT]
│   └── Partners & Accreditation [NEEDS INPUT]
├── Programs
│   ├── Counseling & Guidance
│   ├── [Additional program pages — NEEDS INPUT]
│   └── Impact Stories / Testimonials
├── Get Support (priority nav item)
│   └── Confidential Intake Form
├── Get Involved
│   ├── Volunteer
│   ├── Partner With Us
│   └── Careers [if applicable]
├── Donate
│   ├── One-time / Recurring Giving
│   └── Transparency / Where Funds Go [NEEDS INPUT]
├── News / Blog [optional]
├── Contact Us
└── Legal
    ├── Privacy Policy
    └── Terms of Use
```

---

## 4. Navigation & Header

| Spec | Detail |
|---|---|
| Desktop behavior | Sticky/fixed nav bar, remains visible on scroll |
| Mobile behavior | Collapsed hamburger menu |
| Priority CTA | A high-contrast button always visible in the nav: **"Get Support"** or **"Talk to a Counselor"** — this must never be hidden inside the hamburger collapse on mobile; keep it pinned outside the menu icon |
| Nav order (suggested) | Home · About · Programs · Get Involved · Donate · Contact · **[Get Support]** |

---

## 5. Page-by-Page Specifications

### 5.1 Home / Hero Section

- **Visual:** Full-width hero image or short looped video (compressed), depicting youth in a positive light.
- **Text overlay:** Headline (h1, Montserrat) + supporting line (Inter) + one primary CTA button ("Get Support") and one secondary CTA ("Donate" or "Learn More").
- **Below the fold:** Mission summary (2–3 sentences), 3-column snapshot of impact stats [NEEDS INPUT — e.g., "X youth supported," "Y counselors," "Z communities reached"], and a program preview grid.

### 5.2 About Us

- Mission/vision statement.
- Founding story — grounded, factual tone (avoid dramatization of hardship).
- Team/board bios with photos (respect privacy — get consent for any youth-related imagery).
- Accreditation, registration number, or partner logos to build donor trust **[NEEDS INPUT]**.

### 5.3 Programs

- One card/section per program with: name, short description, who it serves, and outcomes.
- Counseling & Guidance should be the most prominent program given its centrality to the mission.
- Include a testimonials/impact stories subsection — anonymized quotes or case studies (never full names/photos of minors without documented consent).

### 5.4 Get Support — Confidential Intake (Crucial Component)

This is the most sensitive part of the site and requires special care.

**Purpose:** Allow youth in crisis to reach out safely and privately.

**Form fields (keep minimal):**
- Name or Alias (label explicitly as optional/alias allowed)
- Location (town/region — general, not exact address)
- Phone Number / WhatsApp
- Message (free text)

**Required trust elements:**
- Prominent disclaimer near the form: *"Your information is completely confidential and safe with us."*
- Clear statement of what happens after submission (e.g., "A counselor will reach out within 24 hours") **[NEEDS INPUT — confirm actual response SLA]**
- No public visibility of submitted data; no analytics/tracking scripts should fire on this page beyond essential, privacy-respecting analytics.

**Technical requirements:**
- HTTPS only, form submitted over encrypted connection.
- Server-side validation (required fields, phone format) in addition to client-side validation.
- Client-side validation should give simple, human-readable error messages (e.g., "Please enter a phone number so we can reach you" rather than raw field-name errors).
- Rate-limiting and spam protection (e.g., honeypot field or CAPTCHA that doesn't add heavy JS weight) — avoid solutions that block low-end devices or slow networks.
- Data storage: submissions should go to a restricted-access system (e.g., encrypted database or a private helpdesk tool), not a public spreadsheet or unsecured inbox.
- Consider offering a direct WhatsApp click-to-chat link as an alternative to the form, since WhatsApp is widely used in Ghana.

**Crisis-safety note:** If this platform may be reached by a young person in acute distress, ensure the page also states how to get immediate help (e.g., a hotline number) in case a counselor cannot respond right away. **[NEEDS INPUT — local crisis hotline number(s)]**

### 5.5 Get Involved (Volunteer / Partner)

- Volunteer application form (name, contact, skills/interests, availability).
- Partnership inquiry form for organizations/donors.

### 5.6 Donate

- Clear giving options (one-time / recurring) **[NEEDS INPUT — payment processor: e.g., Paystack, Flutterwave, PayPal, Stripe — important since this affects PCI compliance and checkout flow]**.
- Transparency section: how donations are used.
- Trust signals: registration status, financial reporting link if available.

### 5.7 Contact

- General inquiry form (separate from the crisis intake form — do not mix general contact with confidential support requests).
- Physical address / office hours (if applicable) **[NEEDS INPUT]**.
- Social media links.

### 5.8 Legal Pages

- Privacy Policy — must explicitly address how intake-form data (especially from minors) is collected, stored, and protected. **[NEEDS INPUT — legal review recommended given youth data involved]**
- Terms of Use.

---

## 6. Technical Performance & Optimization Rules

Given that most local traffic is on mobile data networks (MTN, Telecel, AirtelTigo):

| Rule | Requirement |
|---|---|
| Image formats | `.webp` or `.avif`, explicitly sized (width/height attributes set to prevent layout shift) |
| Lazy loading | `loading="lazy"` on all non-hero images |
| Compression | All images compressed before upload; hero images especially lightweight |
| Caching | Aggressive browser caching (long cache-control headers) for static assets (CSS, JS, fonts, images) |
| CDN | Serve through a CDN (e.g., Cloudflare) — especially important if international donors/traffic is a goal |
| Minification | Minify all CSS and JS |
| Page weight budget | Initial page weight **under 1.5MB total** |
| Fonts | Load Montserrat & Inter via `font-display: swap` to avoid render-blocking; consider self-hosting fonts to reduce third-party requests |

---

## 7. Accessibility (WCAG 2.1 AA)

| Requirement | Detail |
|---|---|
| Contrast — Gold elements | Any background using `#E5A93C` must pair with dark text (`#1A2E40` or `#2D3142`). White-on-gold is prohibited. |
| Focus states | Visible `:focus` outlines on all interactive elements (links, buttons, form fields) for keyboard navigation |
| Alt text | Descriptive `alt="..."` on all meaningful images, icons, and illustrations; empty `alt=""` for purely decorative images |
| Form labels | Every input has a visible, associated `<label>` (not placeholder-only labels) |
| Semantic HTML | Use proper heading hierarchy (h1 → h2 → h3), landmark regions (`<nav>`, `<main>`, `<footer>`), and ARIA only where semantic HTML is insufficient |
| Touch targets | Minimum ~44×44px tap targets for mobile buttons/links |

---

## 8. Content & Tone Guidelines

- Language: dignified, hopeful, respectful — never pity-based or exploitative.
- Avoid stock "poverty" imagery/language; center agency and progress.
- When describing youth served by counseling programs, use anonymized composite stories or obtain documented consent for real testimonials — never identify a minor without guardian/legal consent.
- Keep intake-form copy warm, simple, and low-literacy-friendly (short sentences, no jargon).

---

## 9. Open Items Requiring Foundation Input

Before development finalizes, please supply:

1. Full program names/descriptions beyond "Counseling & Guidance."
2. Team/board bios and photos.
3. Legal/registration details (NGO registration number, accreditation).
4. Preferred payment processor for donations.
5. Actual response-time commitment for the intake form (e.g., "within 24 hours").
6. Local crisis hotline number(s) to display alongside the intake form.
7. Physical address/office hours, if any.
8. Any existing photography/brand assets, or confirmation that new photography needs to be sourced/commissioned.

---

## 10. Suggested Tech Stack (for developer reference)

*(Not specified in provided brief — recommended defaults compatible with the performance/accessibility requirements above)*

- **Frontend:** Static site generator or lightweight framework (e.g., Astro, Next.js with static export) to minimize JS payload.
- **Forms:** Server-side handling via a secure backend endpoint or a privacy-respecting form service with encrypted storage.
- **Hosting/CDN:** Cloudflare Pages or similar, paired with Cloudflare CDN.
- **Analytics:** Privacy-respecting analytics (e.g., Plausible or Cloudflare Web Analytics) rather than heavier trackers, especially on the intake page.

---

*End of documentation.*
