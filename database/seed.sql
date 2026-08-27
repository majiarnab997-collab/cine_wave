-- ====================================================================
-- CineWave Streaming Platform — Initial Seed Data for Supabase
-- ====================================================================

-- 1. Insert Genres
INSERT INTO public.genres (id, name, slug, description) VALUES
('sci-fi', 'Sci-Fi & Cyberpunk', 'sci-fi', 'Futuristic cosmos and technological anomalies'),
('action', 'Action & Adventure', 'action', 'High-octane chases, martial arts, and explosions'),
('thriller', 'Thriller & Suspense', 'thriller', 'Psychological twists and edge-of-seat tension'),
('drama', 'Drama', 'drama', 'Deep resonant stories of human conflict and triumph'),
('comedy', 'Comedy', 'comedy', 'Clever laughs and satirical heists'),
('family', 'Family & Animation', 'family', 'Enchanting tales suitable for viewers of all ages'),
('documentary', 'Documentaries', 'documentary', 'Nature spectacles and real-world wonders'),
('fantasy', 'Fantasy & Supernatural', 'fantasy', 'Mythical beasts, sorcery, and realm sagas'),
('crime', 'Crime & Mystery', 'crime', 'Underworld syndicates and detective procedurals'),
('horror', 'Horror', 'horror', 'Supernatural dread and psychological chills'),
('romance', 'Romance', 'romance', 'Passionate connections and epic love stories'),
('anime', 'Anime', 'anime', 'Iconic Japanese animation and visual spectacles')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Subscription Plans
INSERT INTO public.subscription_plans (id, name, price_monthly, price_annual, resolution, video_quality, supported_devices_count, features, is_popular) VALUES
('plan-basic', 'Basic (with Ads)', 6.99, 69.99, '1080p Full HD', 'Good', 1, '["1080p Full HD video", "Watch on 1 supported screen", "Unlimited access to entire catalog", "Limited commercial breaks"]'::jsonb, false),
('plan-standard', 'Standard (Ad-Free)', 12.99, 129.99, '1080p Full HD', 'Great', 2, '["1080p Full HD video", "Watch on 2 supported screens simultaneously", "100% Ad-free streaming", "Offline downloads on 2 devices"]'::jsonb, true),
('plan-premium', 'Premium Ultra 4K', 18.99, 189.99, '4K Ultra HD + HDR', 'Best', 4, '["4K (Ultra HD) + HDR10 + Dolby Vision", "Spatial Audio & Dolby Atmos 7.1", "Watch on 4 supported screens simultaneously", "Offline downloads on 6 devices", "VIP early screening access"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Users
INSERT INTO public.users (id, email, name, role, subscription_plan_id, subscription_status, billing_cycle, next_billing_date) VALUES
('usr-1', 'alex@cinewave.tv', 'Alex Vance', 'user', 'plan-premium', 'active', 'monthly', '2026-09-28'),
('usr-admin', 'admin@cinewave.tv', 'System Admin', 'admin', 'plan-premium', 'active', 'annual', '2027-01-01')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Profiles
INSERT INTO public.profiles (id, user_id, name, avatar_url, is_kids, language, maturity_level, autoplay_next, autoplay_previews) VALUES
('prof-alex', 'usr-1', 'Alex', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', false, 'en', 'R', true, true),
('prof-sam', 'usr-1', 'Sam', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', false, 'en', 'TV-14', true, false),
('prof-kids', 'usr-1', 'Kids Club', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80', true, 'en', 'PG', false, false),
('prof-admin', 'usr-admin', 'Admin Master', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', false, 'en', 'NC-17', true, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Feature Movies
INSERT INTO public.movies (
    id, title, description, type, poster_url, backdrop_url, release_year, rating, vote_count,
    maturity_rating, is_original, is_trending, is_featured, is_popular, is_kids_safe, runtime,
    video_url, trailer_url, audio_quality, quality, match_percentage, genres, tags, cast_members, directors
) VALUES
(
    'mov-1', 'Neon Odyssey 2099',
    'In a rain-slicked cyberpunk Tokyo spanning multi-tiered megastructures, an ex-memory hacker uncovers a sinister artificial intelligence syndicate altering human consciousness.',
    'movie',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=85',
    2026, 9.3, 14820, 'R', true, true, true, true, false, 148,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'Dolby Atmos 7.1', '4K Ultra HD', 98,
    '["sci-fi", "action", "thriller"]'::jsonb,
    '["Cyberpunk", "Mind-Bending", "Visually Stunning", "Neo-Noir"]'::jsonb,
    '[{"id":"c1","name":"Elena Rostova","character":"Dr. Sarah Vance","avatarUrl":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"},{"id":"c2","name":"Marcus Chen","character":"Commander Jack Vance","avatarUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"d1","name":"Denis Vane","avatarUrl":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"}]'::jsonb
),
(
    'mov-2', 'Solaris Convergence',
    'An elite deep-space expedition reaches the outer edge of a dying star cluster, discovering an alien beacon that bends the laws of time and reality.',
    'movie',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
    2025, 8.9, 11200, 'PG-13', true, true, true, true, false, 135,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'Dolby 5.1', '4K Ultra HD', 94,
    '["sci-fi", "drama"]'::jsonb,
    '["Cosmic", "Intense", "Philosophical"]'::jsonb,
    '[{"id":"c3","name":"Aria Sterling","character":"Dr. Mae Lind","avatarUrl":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"d2","name":"Maya Lin","avatarUrl":"https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"}]'::jsonb
),
(
    'mov-3', 'Shadow Protocol: Zero Hour',
    'When a stealth cyber weapon triggers a blackout across global satellite defenses, a disavowed black-ops operative has four hours to prevent a thermonuclear escalation.',
    'movie',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    2026, 8.8, 9400, 'R', false, true, true, true, false, 128,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'Dolby Atmos', '4K Ultra HD', 96,
    '["action", "thriller"]'::jsonb,
    '["Espionage", "Adrenaline", "Fast-Paced"]'::jsonb,
    '[{"id":"c4","name":"Gabriel Stone","character":"Cole Becker","avatarUrl":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"d3","name":"Lucas Sterling","avatarUrl":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"}]'::jsonb
),
(
    'mov-4', 'The Enchanted Meadow',
    'A courageous young rabbit and an adventurous flying squirrel embark on a magical quest through mystical enchanted forests to restore the sacred light crystal.',
    'movie',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    2025, 9.1, 8200, 'G', true, false, true, true, true, 92,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'Dolby 5.1', '4K Ultra HD', 99,
    '["family", "comedy", "fantasy"]'::jsonb,
    '["Heartwarming", "Animation", "Family Fun"]'::jsonb,
    '[{"id":"c5","name":"Lily Zhang","character":"Pip the Bunny (Voice)","avatarUrl":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"d4","name":"Sophie Moreau","avatarUrl":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert TV Shows
INSERT INTO public.shows (
    id, title, description, type, poster_url, backdrop_url, release_year, rating, vote_count,
    maturity_rating, is_original, is_trending, is_featured, is_popular, is_kids_safe, seasons_count,
    total_episodes, video_url, audio_quality, quality, match_percentage, genres, tags, cast_members, directors, seasons
) VALUES
(
    'tv-1', 'Quantum Horizon',
    'When particle physicists at a subterranean supercollider accidentally fracture the quantum multiverse, three estranged investigators must navigate colliding timelines.',
    'tv',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
    2026, 9.4, 16500, 'TV-MA', true, true, true, true, false, 2, 8,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'Dolby Atmos', '4K Ultra HD', 97,
    '["sci-fi", "drama", "thriller"]'::jsonb,
    '["Mind-Bending", "Multiverse", "Complex", "Addictive"]'::jsonb,
    '[{"id":"c1","name":"Elena Rostova","character":"Dr. Clara Thorne","avatarUrl":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"},{"id":"c4","name":"Gabriel Stone","character":"Detective Miller","avatarUrl":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"d1","name":"Denis Vane","avatarUrl":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
    '[{"id":"s1","seasonNumber":1,"title":"Season 1: Fracture Point","episodes":[{"id":"tv1-s1e1","seasonNumber":1,"episodeNumber":1,"title":"Anomaly in Sector 7","description":"The collider test registers an unprecedented resonance, pulling Dr. Thorne into an alternate version of Zurich.","runtime":58,"thumbnailUrl":"https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80","videoUrl":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4","introStart":10,"introEnd":45},{"id":"tv1-s1e2","seasonNumber":1,"episodeNumber":2,"title":"The Doppler Mirage","description":"Echoes of future catastrophes manifest in the present as the team scrambles to stabilize the core breach.","runtime":52,"thumbnailUrl":"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80","videoUrl":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4","introStart":10,"introEnd":40}]}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
