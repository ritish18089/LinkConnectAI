-- 07_profile_users.sql

CREATE TABLE IF NOT EXISTS public.profile_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  profile_image_url TEXT,
  full_name TEXT,
  headline TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  location TEXT,
  linkedin_url TEXT,
  bio TEXT,
  website TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  experience_level TEXT,
  skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_profile_users_user_id ON public.profile_users(user_id);

-- Enable RLS
ALTER TABLE public.profile_users ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own profile record
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profile_users') THEN
        CREATE POLICY "Users can view their own profile" ON public.profile_users FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'profile_users') THEN
        CREATE POLICY "Users can insert their own profile" ON public.profile_users FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profile_users') THEN
        CREATE POLICY "Users can update their own profile" ON public.profile_users FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
