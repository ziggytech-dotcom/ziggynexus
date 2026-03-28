-- Sprint 2 Schema Additions
-- NexusIQ — ZiggyTech Creative
-- Created: 2026-03-28

-- ============================================================
-- 1. CUSTOM DOMAIN SUPPORT
-- ============================================================
alter table clients add column if not exists custom_domain text;
alter table clients add column if not exists custom_domain_verified boolean default false;

-- Unique index so two clients can't share a custom domain
create unique index if not exists idx_clients_custom_domain
  on clients(custom_domain)
  where custom_domain is not null;

-- ============================================================
-- 2. PROJECT PHASE PROGRESS PERCENTAGE
-- ============================================================
alter table project_phases
  add column if not exists progress_pct integer default 0
  check (progress_pct >= 0 and progress_pct <= 100);

-- ============================================================
-- 3. KNOWLEDGE BASE ARTICLES
-- ============================================================
create table if not exists kb_articles (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete cascade,
  -- null client_id = visible to all authenticated clients (global article)
  title       text not null,
  slug        text not null,
  content     text not null,
  category    text,           -- e.g. 'Getting Started', 'Billing', 'Process'
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_kb_articles_client_id on kb_articles(client_id);
create index if not exists idx_kb_articles_published  on kb_articles(published);
create index if not exists idx_kb_articles_slug       on kb_articles(slug);
create index if not exists idx_kb_articles_category   on kb_articles(category);

-- ============================================================
-- 4. PORTAL ACTIVITY LOG
-- ============================================================
create table if not exists portal_activity (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid references clients(id) on delete cascade,
  event_type          text not null,
  -- event_type values: file_viewed | deliverable_viewed | payment_made
  --                    message_sent | upload_completed | approval_submitted
  event_data          jsonb default '{}',
  user_email          text,
  workspace_notified  boolean default false,
  created_at          timestamptz default now()
);

create index if not exists idx_portal_activity_client_id   on portal_activity(client_id);
create index if not exists idx_portal_activity_event_type  on portal_activity(event_type);
create index if not exists idx_portal_activity_created_at  on portal_activity(created_at);
create index if not exists idx_portal_activity_notified    on portal_activity(workspace_notified);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table kb_articles    enable row level security;
alter table portal_activity enable row level security;

-- KB: clients can read published articles that are global (no client_id)
-- or specifically assigned to them
create policy "Clients view published kb articles"
  on kb_articles for select
  using (
    published = true
    and (
      client_id is null
      or client_id in (select id from clients where email = auth.email())
    )
  );

-- Activity: clients can insert events for their own client record
create policy "Clients can log activity"
  on portal_activity for insert
  with check (
    client_id in (select id from clients where email = auth.email())
  );

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create trigger set_updated_at_kb_articles
  before update on kb_articles
  for each row execute function update_updated_at();
