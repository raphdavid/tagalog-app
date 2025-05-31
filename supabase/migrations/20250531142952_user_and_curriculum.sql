-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'basic', 'premium')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

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
  type text not null check (type in ('vocabulary', 'multiple_choice', 'fill_in_blank', 'matching')),
  question text not null,
  correct_answer text not null,
  options jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert sample data
INSERT INTO units (title, description, "order") VALUES
('Basic Greetings', 'Learn essential Tagalog greetings and introductions', 1),
('Numbers and Counting', 'Master Tagalog numbers and basic counting', 2);

INSERT INTO lessons (unit_id, title, description, "order", type, is_premium) VALUES
(1, 'Common Greetings', 'Learn the most common Tagalog greetings', 1, 'vocabulary', false),
(1, 'Introducing Yourself', 'Learn how to introduce yourself in Tagalog', 2, 'conversation', false),
(2, 'Numbers 1-10', 'Learn to count from 1 to 10 in Tagalog', 1, 'vocabulary', false);

INSERT INTO questions (lesson_id, type, question, correct_answer, options) VALUES
(1, 'vocabulary', 'salamat', 'thank you', null),
(1, 'vocabulary', 'magandang umaga', 'good morning', null),
(1, 'vocabulary', 'paalam', 'goodbye', null),
(2, 'vocabulary', 'ako si', 'I am', null),
(2, 'vocabulary', 'kumusta ka', 'how are you', null),
(3, 'vocabulary', 'isa', 'one', null),
(3, 'vocabulary', 'dalawa', 'two', null),
(3, 'vocabulary', 'tatlo', 'three', null); 