-- Salon cancellation matching MVP schema

create extension if not exists "pgcrypto";

create type treatment_type as enum ('haircut', 'colour', 'blow_dry', 'nails', 'other');
create type intake_status as enum ('pending', 'offered', 'claimed', 'expired', 'cancelled');
create type slot_status as enum ('open', 'offered', 'filled', 'cancelled');
create type match_status as enum ('offered', 'claimed', 'expired', 'declined');

create table salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table stylists (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  unique (salon_id, phone)
);

create table intake_requests (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  treatment treatment_type not null,
  earliest_time timestamptz not null,
  latest_time timestamptz not null,
  preferred_stylist_id uuid references stylists(id),
  status intake_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_intake_pending_lookup
  on intake_requests (salon_id, treatment, status, created_at);

create table cancellation_slots (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  stylist_id uuid references stylists(id),
  treatment treatment_type not null,
  start_time timestamptz not null,
  duration_minutes integer not null,
  status slot_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_slots_open_lookup
  on cancellation_slots (salon_id, treatment, status);

create table matches (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  slot_id uuid not null references cancellation_slots(id) on delete cascade,
  intake_request_id uuid not null references intake_requests(id) on delete cascade,
  status match_status not null default 'offered',
  claim_token text not null unique,
  offered_at timestamptz not null default now(),
  expires_at timestamptz not null,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enforce at most one CLAIMED match per slot at the DB level (race-condition safe).
-- Partial unique index: only one row per slot_id may have status = 'claimed'.
create unique index uq_slot_single_claim
  on matches (slot_id)
  where (status = 'claimed');

create index idx_matches_slot on matches (slot_id);
create index idx_matches_intake on matches (intake_request_id);
create index idx_matches_expiry on matches (status, expires_at);

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_intake_updated_at before update on intake_requests
  for each row execute function set_updated_at();

create trigger trg_slots_updated_at before update on cancellation_slots
  for each row execute function set_updated_at();
