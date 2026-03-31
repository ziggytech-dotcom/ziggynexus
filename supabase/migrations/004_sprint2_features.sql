-- Sprint 2 Feature Columns
-- ZiggyNexus — White-label, onboarding tour, powered-by toggle
-- Created: 2026-03-31

-- ============================================================
-- 1. WHITE-LABEL BRANDING
-- ============================================================

-- Already added in Sprint 1 — add if not exists for safety
alter table clients add column if not exists brand_logo_url        text;
alter table clients add column if not exists brand_primary_color   text;
alter table clients add column if not exists brand_name            text;
alter table clients add column if not exists onboarding_completed  boolean default false;

-- New: hide "Powered by ZiggyNexus" footer (premium feature)
alter table clients add column if not exists hide_powered_by boolean default false;

-- ============================================================
-- 2. ONBOARDING TOUR
-- ============================================================

-- Track whether the guided tour has been dismissed/completed
alter table clients add column if not exists tour_completed boolean default false;

-- ============================================================
-- 3. SUPABASE STORAGE BUCKET FOR LOGOS
-- ============================================================
-- Run this in the Supabase dashboard Storage section OR via CLI:
-- supabase storage create nexus-logos --public
-- The bucket must be created manually in the Supabase dashboard.
-- Bucket name: nexus-logos
-- Visibility: public (logos are displayed in the portal header)
-- File size limit: 2MB
-- Allowed MIME types: image/png, image/svg+xml, image/jpeg, image/webp

-- ============================================================
-- 4. RLS: allow clients to update their own branding
-- ============================================================
-- Drop and recreate with broader update permission so settings page works
drop policy if exists "Clients can update their own branding" on clients;

create policy "Clients can update their own branding"
  on clients for update
  using (email = auth.email())
  with check (email = auth.email());
