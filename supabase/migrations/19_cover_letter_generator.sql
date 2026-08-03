-- Migration: 19_cover_letter_generator
-- Description: Creates the cover_letter_history table for the Cover Letter Generator module.

CREATE TABLE IF NOT EXISTS public.cover_letter_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cover_letter_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own cover letter history" 
  ON public.cover_letter_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letter history" 
  ON public.cover_letter_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letter history" 
  ON public.cover_letter_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letter history" 
  ON public.cover_letter_history 
  FOR DELETE 
  USING (auth.uid() = user_id);
