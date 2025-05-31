-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  lesson_id bigint references lessons(id) not null,
  completed boolean default false,
  score int,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create user_answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  question_id bigint references questions(id) not null,
  answer text not null,
  is_correct boolean not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answers"
  ON user_answers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own answers"
  ON user_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Add order field to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS "order" int default 0; 