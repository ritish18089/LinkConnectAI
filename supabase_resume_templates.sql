-- Create favorite_resume_templates table
CREATE TABLE IF NOT EXISTS favorite_resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, template_id)
);

-- Create user_resume_templates table (for auto-saving user edits)
CREATE TABLE IF NOT EXISTS user_resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  resume_data jsonb NOT NULL,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, template_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE favorite_resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resume_templates ENABLE ROW LEVEL SECURITY;

-- Policies for favorite_resume_templates
CREATE POLICY "Users can insert their own favorite resume templates."
  ON favorite_resume_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorite resume templates."
  ON favorite_resume_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite resume templates."
  ON favorite_resume_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for user_resume_templates
CREATE POLICY "Users can insert their own resume data."
  ON user_resume_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resume data."
  ON user_resume_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume data."
  ON user_resume_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume data."
  ON user_resume_templates FOR DELETE
  USING (auth.uid() = user_id);
