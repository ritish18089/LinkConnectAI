-- 18_profile_module.sql

-- Add new fields to profile_users table for Profile tracking
ALTER TABLE public.profile_users 
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS total_resumes_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_resumes_downloaded INTEGER DEFAULT 0;
