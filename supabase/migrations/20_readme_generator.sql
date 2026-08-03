-- 20_readme_generator.sql

CREATE TABLE IF NOT EXISTS public.readme_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('profile', 'project')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.readme_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readme history" 
    ON public.readme_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readme history" 
    ON public.readme_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readme history" 
    ON public.readme_history FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readme history" 
    ON public.readme_history FOR DELETE 
    USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS readme_history_user_id_idx ON public.readme_history(user_id);
