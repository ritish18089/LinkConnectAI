-- Table for storing mock interview history
CREATE TABLE IF NOT EXISTS public.mock_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_role text NOT NULL,
  experience_level text NOT NULL,
  interview_type text NOT NULL,
  difficulty text NOT NULL,
  duration_mins integer NOT NULL,
  resume_text text,
  transcript jsonb,
  overall_score integer,
  feedback_report jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS Policies
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own mock interviews"
  ON public.mock_interviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mock interviews"
  ON public.mock_interviews
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mock interviews"
  ON public.mock_interviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mock interviews"
  ON public.mock_interviews
  FOR DELETE
  USING (auth.uid() = user_id);
