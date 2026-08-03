-- Create HR Interview Sessions table
CREATE TABLE IF NOT EXISTS public.hr_interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_text TEXT,
    duration_selected INTEGER NOT NULL DEFAULT 30,
    messages JSONB NOT NULL,
    score INTEGER DEFAULT 0,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hr_interview_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own hr sessions"
    ON public.hr_interview_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hr sessions"
    ON public.hr_interview_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
