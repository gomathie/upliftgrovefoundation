-- ============================================================
-- UpliftGrove Foundation — Supabase Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- ============================================================

-- 1. Contact Submissions (from /contact page)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on contact_submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Volunteer Applications (from /get-involved page — left form)
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on volunteer_applications"
  ON volunteer_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3. Partnership Inquiries (from /get-involved page — right form)
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  partnership_idea TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on partnership_inquiries"
  ON partnership_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Intake Requests (from /support page — confidential counseling)
CREATE TABLE IF NOT EXISTS intake_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,              -- optional, can be alias
  location TEXT NOT NULL,
  phone TEXT NOT NULL,    -- phone or WhatsApp number
  message TEXT NOT NULL,  -- confidential content
  status TEXT DEFAULT 'pending',  -- pending | contacted | resolved
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE intake_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on intake_requests"
  ON intake_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
