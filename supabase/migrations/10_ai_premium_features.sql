-- 10_ai_premium_features.sql

-- Update ai_conversations table
ALTER TABLE public.ai_conversations ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.ai_conversations ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE public.ai_conversations ADD COLUMN IF NOT EXISTS ai_mode TEXT DEFAULT '🌐 Career Advisor';

-- Create ai_favorites table
CREATE TABLE IF NOT EXISTS public.ai_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies for ai_favorites
ALTER TABLE public.ai_favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage their own AI favorites' AND tablename = 'ai_favorites') THEN
        CREATE POLICY "Users manage their own AI favorites" ON public.ai_favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create ai_statistics table
CREATE TABLE IF NOT EXISTS public.ai_statistics (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  total_conversations INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  templates_generated INTEGER DEFAULT 0,
  favorite_ai_mode TEXT DEFAULT '🌐 Career Advisor',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for ai_statistics
ALTER TABLE public.ai_statistics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own stats' AND tablename = 'ai_statistics') THEN
        CREATE POLICY "Users view own stats" ON public.ai_statistics FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own stats' AND tablename = 'ai_statistics') THEN
        CREATE POLICY "Users update own stats" ON public.ai_statistics FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own stats' AND tablename = 'ai_statistics') THEN
        CREATE POLICY "Users insert own stats" ON public.ai_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
