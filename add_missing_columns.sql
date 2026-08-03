-- Add the remaining missing columns to the linkedin_profiles table
ALTER TABLE public.linkedin_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS linkedin_email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_id TEXT;
