-- Personal Hub: archivio YouTube e tassonomia musicale
-- Eseguire nel SQL Editor del progetto Supabase "personal-hub".

create table if not exists public.youtube_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  youtube_playlist_id text not null,
  title text not null default '',
  description text,
  thumbnail_url text,
  item_count integer,
  privacy_status text,
  youtube_published_at timestamptz,
  youtube_updated_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint youtube_playlists_user_youtube_id_key unique (user_id, youtube_playlist_id)
);

create table if not exists public.youtube_playlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  playlist_id uuid not null,
  youtube_playlist_item_id text not null,
  video_id text,
  title text not null default '',
  artist text,
  album text,
  genre text[] not null default '{}',
  subgenre text[] not null default '{}',
  release_year integer,
  description text,
  channel_title text,
  thumbnail_url text,
  position integer,
  video_published_at timestamptz,
  metadata_source text not null default 'youtube',
  metadata_confidence numeric(4,3),
  metadata_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint youtube_playlist_items_playlist_fk
    foreign key (user_id, playlist_id)
    references public.youtube_playlists (user_id, id)
    on delete cascade,
  constraint youtube_playlist_items_playlist_item_key
    unique (user_id, playlist_id, youtube_playlist_item_id),
  constraint youtube_playlist_items_release_year_check
    check (release_year is null or release_year between 1000 and 9999),
  constraint youtube_playlist_items_confidence_check
    check (metadata_confidence is null or metadata_confidence between 0 and 1)
);

create table if not exists public.youtube_sync_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'never_synced',
  last_started_at timestamptz,
  last_completed_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  playlists_synced integer not null default 0,
  playlist_item_pages_synced integer not null default 0,
  videos_synced integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint youtube_sync_state_status_check
    check (status in ('never_synced', 'running', 'success', 'partial', 'error'))
);

-- Tassonomia controllata: i generi principali non hanno parent_genre_id;
-- i sottogeneri puntano al rispettivo genere principale.
create table if not exists public.music_genres (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  parent_genre_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint music_genres_parent_fk
    foreign key (user_id, parent_genre_id)
    references public.music_genres (user_id, id)
    on delete set null,
  constraint music_genres_user_normalized_name_key
    unique (user_id, normalized_name)
);

create index if not exists youtube_playlists_user_updated_idx
  on public.youtube_playlists (user_id, updated_at desc);
create index if not exists youtube_playlist_items_playlist_position_idx
  on public.youtube_playlist_items (user_id, playlist_id, position);
create index if not exists youtube_playlist_items_video_id_idx
  on public.youtube_playlist_items (user_id, video_id);
create index if not exists youtube_playlist_items_genre_gin_idx
  on public.youtube_playlist_items using gin (genre);
create index if not exists youtube_playlist_items_subgenre_gin_idx
  on public.youtube_playlist_items using gin (subgenre);
create index if not exists music_genres_parent_idx
  on public.music_genres (user_id, parent_genre_id);

alter table public.youtube_playlists enable row level security;
alter table public.youtube_playlist_items enable row level security;
alter table public.youtube_sync_state enable row level security;
alter table public.music_genres enable row level security;

drop policy if exists "Users manage their own YouTube playlists" on public.youtube_playlists;
create policy "Users manage their own YouTube playlists"
  on public.youtube_playlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own YouTube playlist items" on public.youtube_playlist_items;
create policy "Users manage their own YouTube playlist items"
  on public.youtube_playlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own YouTube sync state" on public.youtube_sync_state;
create policy "Users manage their own YouTube sync state"
  on public.youtube_sync_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own music genres" on public.music_genres;
create policy "Users manage their own music genres"
  on public.music_genres for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on column public.youtube_playlist_items.genre is
  'Generi musicali assegnati; modifiche manuali da preservare durante la sincronizzazione YouTube.';
comment on column public.youtube_playlist_items.subgenre is
  'Sottogeneri musicali assegnati; modifiche manuali da preservare durante la sincronizzazione YouTube.';
comment on column public.youtube_playlist_items.metadata_source is
  'Origine dei metadati: youtube, manuale o servizio esterno.';
comment on table public.music_genres is
  'Vocabolario personale dei generi e sottogeneri musicali.';
