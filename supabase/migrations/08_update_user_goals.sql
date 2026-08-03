-- 08_update_user_goals.sql

-- Add new columns to user_goals table
ALTER TABLE public.user_goals
ADD COLUMN IF NOT EXISTS daily_connection_goal INTEGER,
ADD COLUMN IF NOT EXISTS daily_template_goal INTEGER,
ADD COLUMN IF NOT EXISTS completed_connections INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_templates INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reset_frequency TEXT DEFAULT 'weekly',
ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMPTZ DEFAULT NOW();

-- Create user_goals_history table
CREATE TABLE IF NOT EXISTS public.user_goals_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  period_identifier TEXT NOT NULL,
  connection_goal INTEGER DEFAULT 0,
  template_goal INTEGER DEFAULT 0,
  completed_connections INTEGER DEFAULT 0,
  completed_templates INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_goals_history
ALTER TABLE public.user_goals_history ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own goal history
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own goal history' AND tablename = 'user_goals_history') THEN
        CREATE POLICY "Users can view their own goal history" ON public.user_goals_history FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own goal history' AND tablename = 'user_goals_history') THEN
        CREATE POLICY "Users can insert their own goal history" ON public.user_goals_history FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
