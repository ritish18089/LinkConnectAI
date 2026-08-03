-- Drop the existing saved_templates table
DROP TABLE IF EXISTS public.saved_templates;

-- Create the new saved_templates table with the specified schema
CREATE TABLE public.saved_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    template_id TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_templates ENABLE ROW LEVEL SECURITY;

-- Policies for saved_templates
CREATE POLICY "Users can insert their own saved templates" 
    ON public.saved_templates FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own saved templates" 
    ON public.saved_templates FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved templates" 
    ON public.saved_templates FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved templates" 
    ON public.saved_templates FOR DELETE 
    USING (auth.uid() = user_id);
