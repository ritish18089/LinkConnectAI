-- Create the favorite_resume_templates table
CREATE TABLE IF NOT EXISTS public.favorite_resume_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE public.favorite_resume_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorite templates"
    ON public.favorite_resume_templates
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite templates"
    ON public.favorite_resume_templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite templates"
    ON public.favorite_resume_templates
    FOR DELETE
    USING (auth.uid() = user_id);
