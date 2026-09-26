-- Run once in Supabase SQL Editor, or apply through the Supabase CLI.
begin;
create table public.products (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique,
 name text not null,
 description text not null default '',
 price integer not null check (price >= 0), -- Rupiah, without formatting
 stock integer not null default 0 check (stock >= 0),
 product_group text not null check (product_group in ('Bunga', 'Karangan Papan Bunga', 'kado dan Cakes')),
 category text not null,
 image_url text not null,
 gallery text[] not null default '{}',
 delivery_cities text[] not null default '{}', -- Empty means not configured, not nationwide delivery
 is_active boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.products enable row level security;
revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
create policy "Visitors can read active products"
 on public.products for select to anon, authenticated
 using (is_active = true);
create index products_active_group_idx on public.products(product_group) where is_active = true;
-- Initial product from the existing detail page. Edit in Table Editor.
insert into public.products (slug, name, description, price, stock, product_group, category, image_url, gallery, is_active)
values ('velvet-orchid-rose', 'Velvet Orchid Rose', 'Rangkaian bunga segar dengan wrapping premium.', 240000, 27, 'Bunga', 'Buket Fresh Flower', '/figma/detail/main.png', array['/figma/detail/thumb-1.png','/figma/detail/thumb-2.png','/figma/detail/thumb-3.png','/figma/detail/thumb-4.png','/figma/detail/thumb-5.png'], true);
commit;
