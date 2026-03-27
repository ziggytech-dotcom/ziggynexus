-- Sprint 1 Schema Additions
-- NexusIQ — ZiggyTech Creative
-- Created: 2026-03-27

-- ============================================================
-- 1. WHITE-LABEL BRANDING — add to clients table
-- ============================================================
alter table clients add column if not exists brand_logo_url text;
alter table clients add column if not exists brand_primary_color text default '#C9A96E';
alter table clients add column if not exists brand_name text; -- agency/portal name override
alter table clients add column if not exists onboarding_completed boolean default false;

-- ============================================================
-- 2. INVOICES TABLE — for payment reminders + recurring billing
-- ============================================================
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  stripe_invoice_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  amount_cents int not null,
  currency text default 'usd',
  status text default 'draft', -- 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  due_date date,
  paid_at timestamptz,
  description text,
  invoice_number text,
  recurring boolean default false,
  recurring_interval text, -- 'monthly' | 'quarterly' | 'annually'
  -- Payment reminder tracking
  reminder_3d_sent_at timestamptz,  -- sent when 3 days overdue
  reminder_7d_sent_at timestamptz,  -- sent when 7 days overdue
  reminder_14d_sent_at timestamptz, -- sent when 14 days overdue
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. CLIENT FILE UPLOADS TABLE
-- ============================================================
create table if not exists client_uploads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  file_name text not null,
  file_path text not null,   -- Supabase storage path: client_id/filename
  file_url text,             -- Public or signed URL
  file_size int,             -- bytes
  file_type text,            -- MIME type e.g. 'image/png', 'application/pdf'
  description text,
  uploaded_by text,          -- email of uploader
  created_at timestamptz default now()
);

-- ============================================================
-- 4. SUPABASE STORAGE BUCKET (client-uploads)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-uploads',
  'client-uploads',
  false,
  52428800, -- 50MB limit
  array['image/jpeg','image/png','image/gif','image/webp','image/svg+xml',
        'application/pdf','application/zip','application/x-zip-compressed',
        'video/mp4','video/quicktime','video/webm',
        'text/plain','text/csv',
        'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do nothing;

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_invoices_client_id on invoices(client_id);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_invoices_due_date on invoices(due_date);
create index if not exists idx_invoices_stripe_invoice_id on invoices(stripe_invoice_id);
create index if not exists idx_client_uploads_client_id on client_uploads(client_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table invoices enable row level security;
alter table client_uploads enable row level security;

-- Invoices: clients can view their own
create policy "Clients can view their invoices"
  on invoices for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

-- Client uploads: clients can view and insert their own
create policy "Clients can view their uploads"
  on client_uploads for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can insert their uploads"
  on client_uploads for insert
  with check (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can delete their own uploads"
  on client_uploads for delete
  using (
    client_id in (select id from clients where email = auth.email())
  );

-- Storage policies for client-uploads bucket
create policy "Clients can upload to their folder"
  on storage.objects for insert
  with check (
    bucket_id = 'client-uploads'
    and auth.role() = 'authenticated'
  );

create policy "Clients can view their own uploads in storage"
  on storage.objects for select
  using (
    bucket_id = 'client-uploads'
    and auth.role() = 'authenticated'
  );

create policy "Clients can delete their own uploads in storage"
  on storage.objects for delete
  using (
    bucket_id = 'client-uploads'
    and auth.role() = 'authenticated'
  );

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create trigger set_updated_at_invoices
  before update on invoices
  for each row execute function update_updated_at();
