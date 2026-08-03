-- Create placement support user progress table
CREATE TABLE IF NOT EXISTS public.placement_user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mcqs_completed INTEGER DEFAULT 0,
    gd_topics_practiced INTEGER DEFAULT 0,
    hr_questions_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.placement_user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for placement_user_progress
CREATE POLICY "Users can view their own placement progress"
    ON public.placement_user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own placement progress"
    ON public.placement_user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own placement progress"
    ON public.placement_user_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
