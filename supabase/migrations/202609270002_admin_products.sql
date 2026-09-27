-- Run in SQL Editor after 202609270001_products.sql. Safe to run again.
begin;
alter table public.products
 add column if not exists size_cm integer check (size_cm > 0),
 add column if not exists tags text[] not null default '{}',
 add column if not exists content_sections jsonb not null default '[]',
 add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_product_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
 new.updated_at = now();
 return new;
end;
$$;
drop trigger if exists product_updated_at on public.products;
create trigger product_updated_at before update on public.products
 for each row execute function public.set_product_updated_at();

-- Public download only; uploads run through the authenticated admin server.
-- No public INSERT/UPDATE/DELETE policies are added.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
 array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
commit;
