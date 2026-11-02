-- ============================================================================
-- Certitude — 0002: categories table
-- ============================================================================
-- The taxonomy lived in TypeScript in Phase 1. It moves into Postgres so
-- categories can be renamed, reordered or retired without a redeploy.
-- ============================================================================

create table if not exists categories (
  slug text primary key,
  name text not null,
  description text not null default '',
  icon text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create index if not exists categories_sort_idx on categories (is_active, sort_order);

-- Keep exams.category honest. Added defensively so the migration is safe to
-- re-run and so it only lands when existing rows already satisfy it.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'exams_category_fk'
  ) and not exists (
    select 1
    from exams e
    left join categories c on c.slug = e.category
    where c.slug is null
  ) then
    alter table exams
      add constraint exams_category_fk
      foreign key (category) references categories (slug)
      on update cascade;
  end if;
end
$$;

alter table categories enable row level security;

drop policy if exists "catalogue: public read categories" on categories;
create policy "catalogue: public read categories"
  on categories for select using (is_active = true);

drop policy if exists "catalogue: staff manage categories" on categories;
create policy "catalogue: staff manage categories"
  on categories for all using (is_staff()) with check (is_staff());
