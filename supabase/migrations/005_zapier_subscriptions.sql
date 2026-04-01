-- Zapier Webhook Subscriptions
-- NexusIQ — ZiggyTech Creative
-- Created: 2026-03-31

create table if not exists zapier_subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references clients(id) on delete cascade,
  event_type text not null,
  target_url text not null,
  secret text,
  created_at timestamptz default now()
);

create index if not exists zapier_subs_ws_event_idx on zapier_subscriptions(workspace_id, event_type);

-- RLS: admin-only via service role (Zapier subscribe/unsubscribe routes use assertAdmin)
alter table zapier_subscriptions enable row level security;

-- Service role bypass (admin routes use createAdminClient which bypasses RLS)
-- No client-facing RLS policies needed — managed exclusively via admin API
