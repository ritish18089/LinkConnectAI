-- Drop the existing linkedin_profiles table and its policies
DROP TABLE IF EXISTS public.linkedin_profiles CASCADE;

-- Create the new linkedin_profiles table
CREATE TABLE public.linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_id TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  profile_picture TEXT,
  profile_url TEXT,
  headline TEXT,
  company TEXT,
  designation TEXT,
  industry TEXT,
  location TEXT,
  country TEXT,
  connected BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.linkedin_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.linkedin_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.linkedin_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.linkedin_profiles FOR DELETE
USING (auth.uid() = user_id);

-- Add an updated_at trigger if it doesn't already exist for this table
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_linkedin_profiles_modtime
BEFORE UPDATE ON public.linkedin_profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
