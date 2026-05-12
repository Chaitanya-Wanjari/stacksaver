create extension if not exists "pgcrypto";

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  company_stage text,
  team_size int not null,
  engineering_team_size int,
  use_case text not null,
  tools jsonb not null,
  result jsonb not null,
  summary text,
  efficiency_score int,
  total_current_spend numeric not null,
  total_recommended_spend numeric not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade,
  email text not null,
  company_name text,
  role text,
  team_size int,
  monthly_savings numeric,
  is_high_savings boolean default false,
  wants_consultation boolean default false,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete set null,
  event_name text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists audits_public_id_idx on audits(public_id);
create index if not exists audits_created_at_idx on audits(created_at desc);
create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists leads_high_savings_idx on leads(is_high_savings);