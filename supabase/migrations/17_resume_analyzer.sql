-- Create Resume Analyzer History Table
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_name TEXT NOT NULL,
    job_description TEXT NOT NULL,
    ats_score INTEGER NOT NULL,
    overall_match INTEGER NOT NULL,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own resume analyses"
    ON public.resume_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analyses"
    ON public.resume_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analyses"
    ON public.resume_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create Index for faster queries
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON public.resume_analyses(user_id);
