-- 06_profile_images.sql

-- Ensure the public.users table exists with avatar_url (if not already present)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own user record
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own data' AND tablename = 'users') THEN
        CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own data' AND tablename = 'users') THEN
        CREATE POLICY "Users can insert their own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own data' AND tablename = 'users') THEN
        CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    END IF;
END $$;


-- Create the 'profile-images' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage.objects
-- Note: 'storage.objects' policies need to reference the bucket_id and path

-- 1. Users can upload their own profile image (Insert)
CREATE POLICY "Users can upload their own profile image" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Users can update their own profile image (Update)
CREATE POLICY "Users can update their own profile image" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Users can delete their own profile image (Delete)
CREATE POLICY "Users can delete their own profile image" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Anyone can view public profile images (Select)
CREATE POLICY "Public profile images are viewable by everyone" ON storage.objects
FOR SELECT
USING ( bucket_id = 'profile-images' );
