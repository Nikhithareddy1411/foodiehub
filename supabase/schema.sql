-- FoodieHub database schema
-- Run this file in Supabase SQL Editor after creating a free project.

create extension if not exists pgcrypto;

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  cuisine text not null,
  description text,
  image_url text,
  rating numeric(2,1) not null default 4.5,
  delivery_minutes text not null default '20–30 min',
  price_level text not null default '$$',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'Popular',
  price numeric(8,2) not null check (price >= 0),
  image_url text,
  is_vegetarian boolean not null default false,
  is_popular boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.favorites enable row level security;

create policy "Restaurants are visible to everyone"
  on public.restaurants for select using (true);
create policy "Available menu items are visible to everyone"
  on public.menu_items for select using (available = true);
create policy "Users can view their own favorites"
  on public.favorites for select to authenticated using (auth.uid() = user_id);
create policy "Users can add their own favorites"
  on public.favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can remove their own favorites"
  on public.favorites for delete to authenticated using (auth.uid() = user_id);

-- Sample restaurants and menus are included in the frontend for the first preview.
-- After deployment, you can optionally import those records into these tables.
