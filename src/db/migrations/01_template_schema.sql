-- Create templates tables for LinkConnect AI

-- Table for system templates (if used for DB syncing)
CREATE TABLE IF NOT EXISTS public.templates (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    tone TEXT NOT NULL,
    short_message TEXT NOT NULL,
    medium_message TEXT NOT NULL,
    long_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for favorite templates
CREATE TABLE IF NOT EXISTS public.favorite_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, template_id)
);

-- Table for recently used templates
CREATE TABLE IF NOT EXISTS public.recent_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, template_id)
);

-- Table for custom user templates
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tone TEXT NOT NULL,
    short_message TEXT NOT NULL,
    medium_message TEXT NOT NULL,
    long_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.favorite_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Policies for templates (Publicly readable)
CREATE POLICY "Templates are viewable by everyone" ON public.templates
    FOR SELECT USING (true);

-- Policies for favorite_templates
CREATE POLICY "Users can insert their own favorites" ON public.favorite_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own favorites" ON public.favorite_templates
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorite_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for recent_templates
CREATE POLICY "Users can insert their own recents" ON public.recent_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own recents" ON public.recent_templates
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recents" ON public.recent_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for custom_templates
CREATE POLICY "Users can insert their own custom templates" ON public.custom_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own custom templates" ON public.custom_templates
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own custom templates" ON public.custom_templates
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own custom templates" ON public.custom_templates
    FOR DELETE USING (auth.uid() = user_id);
