-- Create Virtual GD Sessions table
CREATE TABLE IF NOT EXISTS public.gd_virtual_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_title VARCHAR(255) NOT NULL,
    messages JSONB NOT NULL,
    score INTEGER DEFAULT 0,
    feedback JSONB,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gd_virtual_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own gd sessions"
    ON public.gd_virtual_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gd sessions"
    ON public.gd_virtual_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
