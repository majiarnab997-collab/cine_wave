-- ====================================================================
-- CineWave Streaming Platform — Complete Supabase PostgreSQL Schema
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GENRES TABLE
CREATE TABLE IF NOT EXISTS public.genres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    backdrop_url TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly NUMERIC(6, 2) NOT NULL,
    price_annual NUMERIC(6, 2) NOT NULL,
    resolution TEXT NOT NULL,
    video_quality TEXT NOT NULL,
    supported_devices_count INTEGER DEFAULT 1 NOT NULL,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL, -- 'user' | 'admin'
    subscription_plan_id TEXT REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    subscription_status TEXT DEFAULT 'trial' NOT NULL, -- 'active' | 'trial' | 'cancelled' | 'expired'
    billing_cycle TEXT DEFAULT 'monthly' NOT NULL, -- 'monthly' | 'annual'
    next_billing_date DATE,
    is_suspended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROFILES TABLE (Multi-profile system with Kids mode)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    is_kids BOOLEAN DEFAULT false NOT NULL,
    language TEXT DEFAULT 'en' NOT NULL,
    maturity_level TEXT DEFAULT 'R' NOT NULL,
    autoplay_next BOOLEAN DEFAULT true NOT NULL,
    autoplay_previews BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MOVIES TABLE
CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'movie' NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    logo_url TEXT,
    release_year INTEGER NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 8.0 NOT NULL,
    vote_count INTEGER DEFAULT 1000 NOT NULL,
    maturity_rating TEXT DEFAULT 'PG-13' NOT NULL,
    is_original BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_kids_safe BOOLEAN DEFAULT false,
    runtime INTEGER NOT NULL, -- minutes
    video_url TEXT NOT NULL,
    trailer_url TEXT,
    audio_quality TEXT DEFAULT 'Dolby 5.1',
    quality TEXT DEFAULT '4K Ultra HD',
    match_percentage INTEGER DEFAULT 95,
    genres JSONB DEFAULT '[]'::jsonb NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    cast_members JSONB DEFAULT '[]'::jsonb NOT NULL,
    directors JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TV SHOWS TABLE
CREATE TABLE IF NOT EXISTS public.shows (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'tv' NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    logo_url TEXT,
    release_year INTEGER NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 8.5 NOT NULL,
    vote_count INTEGER DEFAULT 1000 NOT NULL,
    maturity_rating TEXT DEFAULT 'TV-14' NOT NULL,
    is_original BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_kids_safe BOOLEAN DEFAULT false,
    seasons_count INTEGER DEFAULT 1 NOT NULL,
    total_episodes INTEGER DEFAULT 8 NOT NULL,
    video_url TEXT,
    audio_quality TEXT DEFAULT 'Dolby Atmos',
    quality TEXT DEFAULT '4K Ultra HD',
    match_percentage INTEGER DEFAULT 96,
    genres JSONB DEFAULT '[]'::jsonb NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    cast_members JSONB DEFAULT '[]'::jsonb NOT NULL,
    directors JSONB DEFAULT '[]'::jsonb NOT NULL,
    seasons JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. WATCHLIST TABLE (Saved titles per profile)
CREATE TABLE IF NOT EXISTS public.watchlist (
    id TEXT PRIMARY KEY,
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id, media_id)
);

-- 8. CONTINUE WATCHING TABLE (Resume timestamps)
CREATE TABLE IF NOT EXISTS public.continue_watching (
    id TEXT PRIMARY KEY,
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    episode_id TEXT,
    season_number INTEGER,
    episode_number INTEGER,
    current_position INTEGER DEFAULT 0 NOT NULL, -- seconds
    duration INTEGER NOT NULL, -- seconds
    progress_percentage INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id, media_id, episode_id)
);

-- 9. WATCH HISTORY TABLE (Chronological log)
CREATE TABLE IF NOT EXISTS public.watch_history (
    id TEXT PRIMARY KEY,
    profile_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    episode_id TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ACTIVITY TELEMETRY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    event TEXT NOT NULL,
    user_id TEXT,
    profile_id TEXT,
    media_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_movies_genres ON public.movies USING GIN (genres);
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON public.movies(is_featured);
CREATE INDEX IF NOT EXISTS idx_movies_is_trending ON public.movies(is_trending);
CREATE INDEX IF NOT EXISTS idx_shows_genres ON public.shows USING GIN (genres);
CREATE INDEX IF NOT EXISTS idx_watchlist_profile ON public.watchlist(profile_id);
CREATE INDEX IF NOT EXISTS idx_continue_watching_profile ON public.continue_watching(profile_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_profile ON public.watch_history(profile_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.continue_watching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow clients to browse public catalog)
CREATE POLICY "Public can view genres" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Public can view plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Public can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public can view shows" ON public.shows FOR SELECT USING (true);
CREATE POLICY "Public can manage profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public can manage watchlist" ON public.watchlist FOR ALL USING (true);
CREATE POLICY "Public can manage continue_watching" ON public.continue_watching FOR ALL USING (true);
CREATE POLICY "Public can manage watch_history" ON public.watch_history FOR ALL USING (true);
CREATE POLICY "Public can manage users" ON public.users FOR ALL USING (true);
CREATE POLICY "Public can insert activity_logs" ON public.activity_logs FOR ALL USING (true);
