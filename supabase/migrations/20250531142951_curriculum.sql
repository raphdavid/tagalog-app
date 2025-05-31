-- Create curriculum tables
CREATE TABLE IF NOT EXISTS units (
  id bigint primary key generated always as identity,
  title text not null,
  description text not null,
  "order" int not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id bigint primary key generated always as identity,
  unit_id bigint references units(id) not null,
  title text not null,
  description text not null,
  "order" int not null,
  type text not null check (type in ('vocabulary', 'grammar', 'conversation', 'culture', 'quiz')),
  is_premium boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS questions (
  id bigint primary key generated always as identity,
  lesson_id bigint references lessons(id) not null,
  type text not null check (type in ('multiple_choice', 'text_input', 'matching', 'vocabulary')),
  question text not null,
  options jsonb,
  correct_answer text not null,
  explanation text,
  "order" int not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid references auth.users(id) not null,
  lesson_id bigint references lessons(id) not null,
  completed boolean default false,
  score int,
  completed_at timestamp with time zone,
  primary key (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_answers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  question_id bigint references questions(id) not null,
  answer text not null,
  is_correct boolean not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to units"
  ON units FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to lessons"
  ON lessons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to questions"
  ON questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add their own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert test data
INSERT INTO units (title, description, "order") VALUES
('Basics', 'Learn the fundamental building blocks of Tagalog', 1),
('Greetings & Introductions', 'Master common greetings and self-introductions', 2);

INSERT INTO lessons (unit_id, title, description, "order", type, is_premium) VALUES
(1, 'Essential Words', 'Learn the most common Tagalog words', 1, 'vocabulary', false),
(1, 'Basic Phrases', 'Essential phrases for everyday use', 2, 'vocabulary', false),
(2, 'Saying Hello', 'Different ways to greet people', 1, 'vocabulary', false),
(2, 'Introducing Yourself', 'How to introduce yourself in Tagalog', 2, 'conversation', true);

-- Insert vocabulary questions for testing flashcards
INSERT INTO questions (lesson_id, type, question, correct_answer, "order") VALUES
-- Essential Words (Lesson 1)
(1, 'vocabulary', 'salamat', 'thank you', 1),
(1, 'vocabulary', 'oo', 'yes', 2),
(1, 'vocabulary', 'hindi', 'no', 3),
(1, 'vocabulary', 'tubig', 'water', 4),
(1, 'vocabulary', 'pagkain', 'food', 5),

-- Basic Phrases (Lesson 2)
(2, 'vocabulary', 'magandang umaga', 'good morning', 1),
(2, 'vocabulary', 'magandang hapon', 'good afternoon', 2),
(2, 'vocabulary', 'magandang gabi', 'good evening/night', 3),
(2, 'vocabulary', 'paalam', 'goodbye', 4),
(2, 'vocabulary', 'kumusta ka?', 'how are you?', 5),

-- Saying Hello (Lesson 3)
(3, 'vocabulary', 'kamusta', 'hello/how are you', 1),
(3, 'vocabulary', 'magandang araw', 'good day', 2),
(3, 'vocabulary', 'maayong buntag', 'good morning (Cebuano)', 3),
(3, 'vocabulary', 'mabuhay', 'welcome/cheers/long live', 4),
(3, 'vocabulary', 'hanggang sa muli', 'until next time', 5); 