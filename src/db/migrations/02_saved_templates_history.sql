-- Create template_history table for LinkConnect AI

-- Ensure saved_templates has necessary columns (adding IF NOT EXISTS just in case it already exists but is missing category)
CREATE TABLE IF NOT EXISTS public.saved_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for tracking history of used templates
CREATE TABLE IF NOT EXISTS public.template_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add category column to saved_templates if it doesn't exist (in case table was previously created)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='saved_templates' AND column_name='category') THEN
        ALTER TABLE public.saved_templates ADD COLUMN category TEXT DEFAULT 'Custom';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='saved_templates' AND column_name='updated_at') THEN
        ALTER TABLE public.saved_templates ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- Setup Row Level Security (RLS)
ALTER TABLE public.saved_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_history ENABLE ROW LEVEL SECURITY;

-- Policies for saved_templates
CREATE POLICY "Users can insert their own saved templates" ON public.saved_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own saved templates" ON public.saved_templates
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved templates" ON public.saved_templates
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved templates" ON public.saved_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for template_history
CREATE POLICY "Users can insert their own template history" ON public.template_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own template history" ON public.template_history
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own template history" ON public.template_history
    FOR DELETE USING (auth.uid() = user_id);

