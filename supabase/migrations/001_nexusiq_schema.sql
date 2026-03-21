-- NexusIQ Schema
-- ZiggyTech Creative — Client Portal & Approval Hub
-- Created: 2026-03-20

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Clients table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  email text,
  phone text,
  company text,
  avatar_url text,
  package text, -- 'starter' | 'growth' | 'retainer' | 'enterprise'
  status text default 'active', -- 'active' | 'paused' | 'completed'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deliverables table
create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  title text not null,
  description text,
  type text not null, -- 'brand_asset' | 'website' | 'social' | 'report' | 'video'
  status text default 'pending_review', -- 'pending_review' | 'approved' | 'changes_requested' | 'rejected'
  file_url text,
  preview_url text,
  thumbnail_url text,
  version int default 1,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

-- Deliverable versions (full history)
create table if not exists deliverable_versions (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  version int not null,
  file_url text,
  preview_url text,
  notes text,
  created_by text,
  created_at timestamptz default now()
);

-- Approval comments
create table if not exists approval_comments (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  author text not null,
  author_role text default 'client', -- 'client' | 'ztc_team'
  comment text not null,
  created_at timestamptz default now()
);

-- Project phases tracker
create table if not exists project_phases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  phase text not null, -- 'discovery' | 'brand_identity' | 'website' | 'content_social' | 'launch'
  status text default 'pending', -- 'pending' | 'in_progress' | 'in_review' | 'complete' | 'on_hold'
  due_date date,
  notes text,
  order_index int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Social content calendar
create table if not exists social_calendar (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  deliverable_id uuid references deliverables(id) on delete set null,
  platform text not null, -- 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'x'
  caption text,
  scheduled_at timestamptz,
  status text default 'draft', -- 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'posted'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notifications log
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  type text not null, -- 'new_deliverable' | 'approval_needed' | 'approved' | 'changes_requested' | 'go_live'
  title text not null,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_deliverables_client_id on deliverables(client_id);
create index if not exists idx_deliverables_status on deliverables(status);
create index if not exists idx_deliverables_type on deliverables(type);
create index if not exists idx_approval_comments_deliverable_id on approval_comments(deliverable_id);
create index if not exists idx_project_phases_client_id on project_phases(client_id);
create index if not exists idx_social_calendar_client_id on social_calendar(client_id);
create index if not exists idx_social_calendar_scheduled_at on social_calendar(scheduled_at);
create index if not exists idx_notifications_client_id on notifications(client_id);
create index if not exists idx_notifications_read on notifications(read);

-- Enable Row Level Security
alter table clients enable row level security;
alter table deliverables enable row level security;
alter table deliverable_versions enable row level security;
alter table approval_comments enable row level security;
alter table project_phases enable row level security;
alter table social_calendar enable row level security;
alter table notifications enable row level security;

-- RLS Policies (clients can only see their own data)
-- Note: These use auth.email() — in production, match client email to auth user

create policy "Clients can view their own record"
  on clients for select
  using (email = auth.email() or auth.email() in (
    select email from clients where id = clients.id
  ));

create policy "Clients can view their deliverables"
  on deliverables for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can update deliverable status"
  on deliverables for update
  using (
    client_id in (select id from clients where email = auth.email())
  )
  with check (status in ('approved', 'changes_requested', 'rejected'));

create policy "Clients can view their delivery versions"
  on deliverable_versions for select
  using (
    deliverable_id in (
      select id from deliverables where client_id in (
        select id from clients where email = auth.email()
      )
    )
  );

create policy "Clients can insert approval comments"
  on approval_comments for insert
  with check (
    deliverable_id in (
      select id from deliverables where client_id in (
        select id from clients where email = auth.email()
      )
    )
  );

create policy "Clients can view approval comments"
  on approval_comments for select
  using (
    deliverable_id in (
      select id from deliverables where client_id in (
        select id from clients where email = auth.email()
      )
    )
  );

create policy "Clients can view their phases"
  on project_phases for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can view their social calendar"
  on social_calendar for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can view their notifications"
  on notifications for select
  using (
    client_id in (select id from clients where email = auth.email())
  );

create policy "Clients can mark notifications read"
  on notifications for update
  using (
    client_id in (select id from clients where email = auth.email())
  )
  with check (read = true);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_clients
  before update on clients
  for each row execute function update_updated_at();

create trigger set_updated_at_deliverables
  before update on deliverables
  for each row execute function update_updated_at();

create trigger set_updated_at_project_phases
  before update on project_phases
  for each row execute function update_updated_at();

create trigger set_updated_at_social_calendar
  before update on social_calendar
  for each row execute function update_updated_at();
