-- 19_profile_badges.sql

-- Add earned_badges to profile_users table to track unlocked badges and prevent duplicate XP awards
ALTER TABLE public.profile_users 
ADD COLUMN IF NOT EXISTS earned_badges JSONB DEFAULT '[]'::jsonb;
