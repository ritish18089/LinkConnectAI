-- Create detailed MCQ user progress table
CREATE TABLE IF NOT EXISTS public.mcq_user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    field VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    total_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    highest_score DECIMAL(5,2) DEFAULT 0.0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    last_attempt_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, field, subject)
);

-- Enable RLS
ALTER TABLE public.mcq_user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own mcq progress"
    ON public.mcq_user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mcq progress"
    ON public.mcq_user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mcq progress"
    ON public.mcq_user_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
