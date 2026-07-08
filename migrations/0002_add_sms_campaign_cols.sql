-- ============================================================
-- UpliftGrove Foundation — Add SMS Campaign Columns to intake_requests
-- Run this in the Supabase SQL Editor if you want to track campaign IDs
-- ============================================================

ALTER TABLE intake_requests 
ADD COLUMN IF NOT EXISTS sms_user_campaign_id TEXT;

ALTER TABLE intake_requests 
ADD COLUMN IF NOT EXISTS sms_counselor_campaign_id TEXT;
