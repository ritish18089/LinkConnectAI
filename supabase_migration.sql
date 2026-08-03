-- 1. Add missing columns to linkedin_profiles table
ALTER TABLE public.linkedin_profiles 
ADD COLUMN IF NOT EXISTS connected BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 2. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Create a trigger to call the function on update
DROP TRIGGER IF EXISTS update_linkedin_profiles_updated_at ON public.linkedin_profiles;
CREATE TRIGGER update_linkedin_profiles_updated_at
BEFORE UPDATE ON public.linkedin_profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 4. Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Add RLS Policies (safely using DO block to avoid errors if they exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'linkedin_profiles' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
        ON public.linkedin_profiles
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'linkedin_profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile"
        ON public.linkedin_profiles
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'linkedin_profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
        ON public.linkedin_profiles
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'linkedin_profiles' AND policyname = 'Users can delete their own profile'
    ) THEN
        CREATE POLICY "Users can delete their own profile"
        ON public.linkedin_profiles
        FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 6. Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'Unread',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon (for public form submission)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Allow public insert to contact_messages'
    ) THEN
        CREATE POLICY "Allow public insert to contact_messages"
        ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
END
$$;
