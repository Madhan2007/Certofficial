-- ============================================================================
-- Certitude — Phase 1 schema
-- ============================================================================
-- Design rule: catalogue, offer and inventory are three separate layers.
--   catalogue  → what the certification is
--   offer      → what we can sell and at what price
--   inventory  → the actual code, which is never readable by a client
--
-- Apply with:  supabase db push   (or paste into the SQL editor)
-- ============================================================================

create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer'
    check (role in ('customer', 'staff', 'admin')),
  gstin text,
  billing_name text,
  billing_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile for every new auth user.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from profiles where id = auth.uid()), 'anon');
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_role() in ('staff', 'admin');
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
create table if not exists providers (
  slug text primary key,
  name text not null,
  short_name text not null,
  mark text not null default '',
  description text not null default '',
  website_url text not null default '',
  accent text not null default '#111827',
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger providers_updated_at
  before update on providers
  for each row execute function set_updated_at();

create table if not exists exams (
  slug text primary key,
  code text not null,
  name text not null,
  provider_slug text not null references providers (slug) on update cascade,
  level text not null
    check (level in ('foundational', 'associate', 'professional', 'specialty', 'expert')),
  category text not null,
  summary text not null default '',
  description text not null default '',
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  question_count integer not null default 0 check (question_count >= 0),
  passing_score text not null default '',
  languages text[] not null default '{}',
  official_price_inr integer not null default 0 check (official_price_inr >= 0),
  official_price_usd integer not null default 0 check (official_price_usd >= 0),
  retire_at date,
  exam_url text not null default '',
  audience text not null default '',
  study_hours integer not null default 0,
  skills text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  popularity integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exams_provider_idx on exams (provider_slug);
create index if not exists exams_category_idx on exams (category);
create index if not exists exams_level_idx on exams (level);
create index if not exists exams_active_popularity_idx on exams (is_active, popularity desc);
create index if not exists exams_search_idx on exams using gin (name gin_trgm_ops);

create trigger exams_updated_at
  before update on exams
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Supply
-- ---------------------------------------------------------------------------
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  authorization_status text not null default 'pending'
    check (authorization_status in ('pending', 'verified', 'expired', 'revoked')),
  authorization_doc_url text,
  authorization_expires_at date,
  trust_score numeric(4, 3) not null default 0 check (trust_score between 0 and 1),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger suppliers_updated_at
  before update on suppliers
  for each row execute function set_updated_at();

create table if not exists offers (
  id text primary key,
  exam_slug text not null references exams (slug) on update cascade on delete cascade,
  supplier_id uuid references suppliers (id) on delete set null,
  supplier_name text not null default '',
  supply_status text not null default 'quote'
    check (supply_status in ('verified', 'affiliate', 'quote', 'unavailable')),
  price_inr integer not null check (price_inr >= 0),
  compare_at_inr integer not null check (compare_at_inr >= 0),
  currency text not null default 'INR',
  region text not null default 'India',
  eligibility text not null default 'Open to all candidates',
  delivery_estimate text not null default '',
  voucher_validity_days integer not null default 365 check (voucher_validity_days > 0),
  stock_confidence numeric(4, 3) not null default 0.5,
  last_verified_at timestamptz not null default now(),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_exam_idx on offers (exam_slug);
create index if not exists offers_status_idx on offers (supply_status, is_active);

create trigger offers_updated_at
  before update on offers
  for each row execute function set_updated_at();

create table if not exists price_history (
  id bigserial primary key,
  offer_id text not null references offers (id) on delete cascade,
  price_inr integer not null,
  recorded_at timestamptz not null default now()
);

create index if not exists price_history_offer_idx
  on price_history (offer_id, recorded_at desc);

-- Every offer price change writes a history row automatically.
create or replace function record_price_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.price_inr is distinct from old.price_inr then
    insert into price_history (offer_id, price_inr) values (new.id, new.price_inr);
  elsif tg_op = 'INSERT' then
    insert into price_history (offer_id, price_inr) values (new.id, new.price_inr);
  end if;
  return new;
end;
$$;

create trigger offers_price_history
  after insert or update of price_inr on offers
  for each row execute function record_price_change();

-- ---------------------------------------------------------------------------
-- Inventory — never exposed to the client
-- ---------------------------------------------------------------------------
create table if not exists voucher_batches (
  id uuid primary key default gen_random_uuid(),
  offer_id text not null references offers (id) on delete cascade,
  supplier_id uuid references suppliers (id) on delete set null,
  unit_cost_inr integer not null default 0,
  quantity integer not null default 0 check (quantity >= 0),
  received_at timestamptz not null default now(),
  expires_at timestamptz,
  notes text
);

create table if not exists voucher_inventory (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references voucher_batches (id) on delete set null,
  offer_id text not null references offers (id) on delete cascade,
  code_encrypted text not null,
  code_hash text not null,
  code_last4 text not null default '',
  status text not null default 'available'
    check (status in ('available', 'reserved', 'delivered', 'void', 'expired')),
  order_id uuid,
  reserved_at timestamptz,
  delivered_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (code_hash)
);

create index if not exists voucher_inventory_pick_idx
  on voucher_inventory (offer_id, status, expires_at);
create index if not exists voucher_inventory_order_idx
  on voucher_inventory (order_id);

-- ---------------------------------------------------------------------------
-- Commerce
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references profiles (id) on delete set null,
  email text not null,
  phone text,
  status text not null default 'pending'
    check (status in (
      'pending', 'paid', 'allocated', 'delivered',
      'completed', 'expired', 'refunded', 'replaced', 'failed'
    )),
  currency text not null default 'INR',
  subtotal_inr integer not null default 0,
  discount_inr integer not null default 0,
  tax_inr integer not null default 0,
  total_inr integer not null default 0,
  coupon_code text,
  gstin text,
  billing_name text,
  billing_address text,
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  delivered_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on orders (user_id, created_at desc);
create index if not exists orders_status_idx on orders (status, created_at desc);
create index if not exists orders_email_idx on orders (lower(email));

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

alter table voucher_inventory
  drop constraint if exists voucher_inventory_order_fk;
alter table voucher_inventory
  add constraint voucher_inventory_order_fk
  foreign key (order_id) references orders (id) on delete set null;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  offer_id text references offers (id) on delete set null,
  exam_slug text,
  exam_code text not null,
  exam_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_inr integer not null default 0,
  total_price_inr integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  gateway text not null default 'razorpay',
  gateway_order_id text,
  gateway_payment_id text,
  gateway_event_id text unique,          -- webhook idempotency key
  amount_inr integer not null default 0,
  currency text not null default 'INR',
  status text not null default 'created'
    check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
  signature_verified boolean not null default false,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_order_idx on payments (order_id);

create trigger payments_updated_at
  before update on payments
  for each row execute function set_updated_at();

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  payment_id uuid references payments (id) on delete set null,
  amount_inr integer not null default 0,
  reason text,
  status text not null default 'requested'
    check (status in ('requested', 'processing', 'completed', 'failed')),
  gateway_refund_id text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  order_item_id uuid references order_items (id) on delete cascade,
  inventory_id uuid references voucher_inventory (id) on delete set null,
  channel text not null default 'email'
    check (channel in ('email', 'account', 'whatsapp', 'manual')),
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'revealed', 'failed')),
  sent_at timestamptz,
  revealed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists deliveries_order_idx on deliveries (order_id);

-- ---------------------------------------------------------------------------
-- Growth, trust and ops
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  email text not null,
  phone text,
  exam_slug text,
  exam_code text,
  quantity integer not null default 1,
  city text,
  target_date text,
  company text,
  gstin text,
  message text,
  intent text not null default 'single'
    check (intent in ('single', 'bulk', 'notify')),
  source text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on leads (status, created_at desc);
create index if not exists leads_email_idx on leads (lower(email));

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

create table if not exists coupons (
  code text primary key,
  description text,
  discount_type text not null default 'percent'
    check (discount_type in ('percent', 'fixed')),
  discount_value integer not null default 0,
  min_order_inr integer not null default 0,
  max_uses integer,
  used_count integer not null default 0,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders (id) on delete set null,
  user_id uuid references profiles (id) on delete set null,
  exam_slug text references exams (slug) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text,
  exam_outcome text check (exam_outcome in ('passed', 'failed', 'not_taken')),
  status text not null default 'pending'
    check (status in ('pending', 'published', 'rejected')),
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_exam_idx on reviews (exam_slug, status);
create unique index if not exists reviews_one_per_order_item
  on reviews (order_id) where order_id is not null;

create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_slug text not null references exams (slug) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, exam_slug)
);

create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  email text not null,
  exam_slug text not null references exams (slug) on delete cascade,
  target_price_inr integer,
  channel text not null default 'email',
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor_id uuid references profiles (id) on delete set null,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on audit_logs (entity, entity_id);
create index if not exists audit_logs_created_idx on audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- Atomic allocation
-- ---------------------------------------------------------------------------
create or replace function reserve_voucher(p_offer_id text, p_order_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  with picked as (
    select id
    from voucher_inventory
    where offer_id = p_offer_id
      and status = 'available'
      and expires_at > now()
    order by expires_at asc
    for update skip locked
    limit 1
  )
  update voucher_inventory v
  set status = 'reserved',
      order_id = p_order_id,
      reserved_at = now()
  from picked
  where v.id = picked.id
  returning v.id into v_id;

  if v_id is null then
    raise exception 'OUT_OF_STOCK' using errcode = 'P0001';
  end if;

  return v_id;
end;
$$;

create or replace function release_expired_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  released integer;
begin
  with stale as (
    select id from voucher_inventory
    where status = 'reserved'
      and reserved_at < now() - interval '20 minutes'
    for update skip locked
  )
  update voucher_inventory v
  set status = 'available', order_id = null, reserved_at = null
  from stale
  where v.id = stale.id;

  get diagnostics released = row_count;
  return released;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table providers enable row level security;
alter table exams enable row level security;
alter table offers enable row level security;
alter table price_history enable row level security;
alter table suppliers enable row level security;
alter table voucher_batches enable row level security;
alter table voucher_inventory enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table refunds enable row level security;
alter table deliveries enable row level security;
alter table leads enable row level security;
alter table coupons enable row level security;
alter table reviews enable row level security;
alter table saved_items enable row level security;
alter table price_alerts enable row level security;
alter table audit_logs enable row level security;

-- Public catalogue: read-only, active rows only.
drop policy if exists "catalogue: public read providers" on providers;
create policy "catalogue: public read providers"
  on providers for select using (true);

drop policy if exists "catalogue: public read exams" on exams;
create policy "catalogue: public read exams"
  on exams for select using (is_active = true);

drop policy if exists "catalogue: public read offers" on offers;
create policy "catalogue: public read offers"
  on offers for select using (is_active = true);

drop policy if exists "catalogue: staff manage providers" on providers;
create policy "catalogue: staff manage providers"
  on providers for all using (is_staff()) with check (is_staff());

drop policy if exists "catalogue: staff manage exams" on exams;
create policy "catalogue: staff manage exams"
  on exams for all using (is_staff()) with check (is_staff());

drop policy if exists "catalogue: staff manage offers" on offers;
create policy "catalogue: staff manage offers"
  on offers for all using (is_staff()) with check (is_staff());

drop policy if exists "catalogue: staff manage price history" on price_history;
create policy "catalogue: staff manage price history"
  on price_history for select using (is_staff());

-- Profiles
drop policy if exists "profiles: self read" on profiles;
create policy "profiles: self read"
  on profiles for select using (auth.uid() = id or is_staff());

drop policy if exists "profiles: self update" on profiles;
create policy "profiles: self update"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles: staff manage" on profiles;
create policy "profiles: staff manage"
  on profiles for all using (is_staff()) with check (is_staff());

-- Orders: owners read their own; staff read all. Writes go through the server.
drop policy if exists "orders: owner read" on orders;
create policy "orders: owner read"
  on orders for select using (auth.uid() = user_id or is_staff());

drop policy if exists "order items: owner read" on order_items;
create policy "order items: owner read"
  on order_items for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or is_staff())
    )
  );

drop policy if exists "deliveries: owner read" on deliveries;
create policy "deliveries: owner read"
  on deliveries for select using (
    exists (
      select 1 from orders o
      where o.id = deliveries.order_id
      and (o.user_id = auth.uid() or is_staff())
    )
  );

drop policy if exists "refunds: owner read" on refunds;
create policy "refunds: owner read"
  on refunds for select using (
    exists (
      select 1 from orders o
      where o.id = refunds.order_id
      and (o.user_id = auth.uid() or is_staff())
    )
  );

-- Payments and inventory: no client policies at all. Service role only.

-- Leads: anonymous insert allowed, never readable by clients.
drop policy if exists "leads: anonymous insert" on leads;
create policy "leads: anonymous insert"
  on leads for insert with check (true);

drop policy if exists "leads: staff read" on leads;
create policy "leads: staff read"
  on leads for select using (is_staff());

drop policy if exists "leads: staff update" on leads;
create policy "leads: staff update"
  on leads for update using (is_staff()) with check (is_staff());

-- Reviews: published reviews are public; authors see their own.
drop policy if exists "reviews: public read published" on reviews;
create policy "reviews: public read published"
  on reviews for select using (status = 'published' or user_id = auth.uid() or is_staff());

drop policy if exists "reviews: insert own" on reviews;
create policy "reviews: insert own"
  on reviews for insert with check (auth.uid() = user_id);

drop policy if exists "reviews: staff moderate" on reviews;
create policy "reviews: staff moderate"
  on reviews for update using (is_staff()) with check (is_staff());

-- Saved items and price alerts are strictly per-user.
drop policy if exists "saved: owner all" on saved_items;
create policy "saved: owner all"
  on saved_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "alerts: owner all" on price_alerts;
create policy "alerts: owner all"
  on price_alerts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "alerts: anonymous insert" on price_alerts;
create policy "alerts: anonymous insert"
  on price_alerts for insert with check (user_id is null);

-- Coupons: readable if active so the client can validate, writes staff-only.
drop policy if exists "coupons: public read active" on coupons;
create policy "coupons: public read active"
  on coupons for select using (is_active = true);

drop policy if exists "coupons: staff manage" on coupons;
create policy "coupons: staff manage"
  on coupons for all using (is_staff()) with check (is_staff());

-- Audit logs: staff read, append-only via service role.
drop policy if exists "audit: staff read" on audit_logs;
create policy "audit: staff read"
  on audit_logs for select using (is_staff());

-- ---------------------------------------------------------------------------
-- Convenience view for the public catalogue
-- ---------------------------------------------------------------------------
create or replace view public_catalogue
with (security_invoker = true) as
select
  e.slug,
  e.code,
  e.name,
  e.provider_slug,
  p.short_name as provider_name,
  e.level,
  e.category,
  e.summary,
  e.duration_minutes,
  e.question_count,
  e.passing_score,
  e.official_price_inr,
  e.popularity,
  o.id as offer_id,
  o.price_inr,
  o.compare_at_inr,
  o.supply_status,
  o.delivery_estimate,
  o.voucher_validity_days,
  o.last_verified_at
from exams e
join providers p on p.slug = e.provider_slug
left join offers o on o.exam_slug = e.slug and o.is_active
where e.is_active;

grant select on public_catalogue to anon, authenticated;
