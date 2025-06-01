-- Flashcard Data for Tagalog Learning App
-- Run this in your Supabase SQL Editor to populate vocabulary lessons

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM questions;
-- DELETE FROM lessons;
-- DELETE FROM units;

-- Create user progress and answers tables first (if they don't exist)
CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid references auth.users(id),
  lesson_id bigint references lessons(id),
  completed boolean default false,
  score integer,
  completed_at timestamp with time zone default now(),
  primary key (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_answers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),
  question_id bigint references questions(id),
  answer text,
  is_correct boolean,
  created_at timestamp with time zone default now()
);

-- Insert units and capture their IDs
WITH inserted_units AS (
  INSERT INTO units (title, description, "order") VALUES
    ('Basic Greetings & Introductions', 'Learn essential Tagalog greetings and how to introduce yourself', 1),
    ('Family & Relationships', 'Learn words for family members and relationships', 2),
    ('Daily Activities', 'Common words for everyday activities', 3),
    ('Food & Dining', 'Essential vocabulary for food and eating', 4),
    ('Numbers & Time', 'Numbers, counting, and time expressions', 5),
    ('Colors & Descriptions', 'Colors and descriptive words', 6)
  RETURNING id, "order"
),
-- Insert lessons using the actual unit IDs
inserted_lessons AS (
  INSERT INTO lessons (unit_id, title, description, "order", type, is_premium)
  SELECT 
    u.id,
    l.title,
    l.description,
    l.lesson_order,
    l.type,
    l.is_premium
  FROM inserted_units u
  JOIN (VALUES
    -- Unit 1: Basic Greetings
    (1, 'Common Greetings', 'Essential greetings for daily use', 1, 'vocabulary', false),
    (1, 'Polite Expressions', 'Please, thank you, and other courtesies', 2, 'vocabulary', false),
    (1, 'Basic Introductions', 'How to introduce yourself and others', 3, 'vocabulary', false),
    
    -- Unit 2: Family
    (2, 'Immediate Family', 'Parents, siblings, and close family', 1, 'vocabulary', false),
    (2, 'Extended Family', 'Aunts, uncles, cousins, and grandparents', 2, 'vocabulary', true),
    
    -- Unit 3: Daily Activities
    (3, 'Morning Routine', 'Activities you do in the morning', 1, 'vocabulary', false),
    (3, 'Work & School', 'Professional and educational activities', 2, 'vocabulary', true),
    
    -- Unit 4: Food
    (4, 'Basic Foods', 'Common foods and ingredients', 1, 'vocabulary', false),
    (4, 'Filipino Dishes', 'Traditional Filipino foods', 2, 'vocabulary', true),
    
    -- Unit 5: Numbers & Time
    (5, 'Numbers 1-20', 'Basic counting', 1, 'vocabulary', false),
    (5, 'Time Expressions', 'Telling time and time-related words', 2, 'vocabulary', false),
    
    -- Unit 6: Colors & Descriptions
    (6, 'Basic Colors', 'Common colors', 1, 'vocabulary', false),
    (6, 'Descriptive Words', 'Adjectives for describing things', 2, 'vocabulary', true)
  ) AS l(unit_order, title, description, lesson_order, type, is_premium)
  ON u."order" = l.unit_order
  RETURNING id, unit_id, "order", title
)
-- Insert vocabulary questions using the actual lesson IDs
INSERT INTO questions (lesson_id, type, question, correct_answer, options, explanation, "order")
SELECT 
  il.id,
  'vocabulary',
  q.question,
  q.correct_answer,
  NULL,
  'Practice this vocabulary word by seeing the English and remembering the Tagalog translation.',
  q.question_order
FROM inserted_lessons il
JOIN inserted_units iu ON il.unit_id = iu.id
JOIN (VALUES
  -- Unit 1, Lesson 1: Common Greetings
  (1, 1, 1, 'Hello', 'Kumusta'),
  (1, 1, 2, 'Good morning', 'Magandang umaga'),
  (1, 1, 3, 'Good afternoon', 'Magandang hapon'),
  (1, 1, 4, 'Good evening', 'Magandang gabi'),
  (1, 1, 5, 'Good night', 'Magandang gabi'),
  (1, 1, 6, 'How are you?', 'Kumusta ka?'),
  (1, 1, 7, 'Goodbye', 'Paalam'),
  (1, 1, 8, 'See you later', 'Hanggang sa muli'),

  -- Unit 1, Lesson 2: Polite Expressions
  (1, 2, 1, 'Thank you', 'Salamat'),
  (1, 2, 2, 'Please', 'Pakisuyo'),
  (1, 2, 3, 'Excuse me', 'Pasensya na'),
  (1, 2, 4, 'Sorry', 'Pasensya'),
  (1, 2, 5, 'You''re welcome', 'Walang anuman'),
  (1, 2, 6, 'Yes', 'Oo'),
  (1, 2, 7, 'No', 'Hindi'),

  -- Unit 1, Lesson 3: Basic Introductions
  (1, 3, 1, 'My name is', 'Ang pangalan ko ay'),
  (1, 3, 2, 'I am', 'Ako ay'),
  (1, 3, 3, 'What is your name?', 'Ano ang pangalan mo?'),
  (1, 3, 4, 'Nice to meet you', 'Natutuwa akong makilala ka'),
  (1, 3, 5, 'Where are you from?', 'Saan ka galing?'),
  (1, 3, 6, 'I am from', 'Galing ako sa'),

  -- Unit 2, Lesson 1: Immediate Family
  (2, 1, 1, 'Mother', 'Ina / Nanay'),
  (2, 1, 2, 'Father', 'Ama / Tatay'),
  (2, 1, 3, 'Sister', 'Kapatid na babae'),
  (2, 1, 4, 'Brother', 'Kapatid na lalaki'),
  (2, 1, 5, 'Child', 'Anak'),
  (2, 1, 6, 'Son', 'Anak na lalaki'),
  (2, 1, 7, 'Daughter', 'Anak na babae'),
  (2, 1, 8, 'Family', 'Pamilya'),

  -- Unit 2, Lesson 2: Extended Family
  (2, 2, 1, 'Grandmother', 'Lola'),
  (2, 2, 2, 'Grandfather', 'Lolo'),
  (2, 2, 3, 'Aunt', 'Tita'),
  (2, 2, 4, 'Uncle', 'Tito'),
  (2, 2, 5, 'Cousin', 'Pinsan'),
  (2, 2, 6, 'Nephew', 'Pamangkin na lalaki'),
  (2, 2, 7, 'Niece', 'Pamangkin na babae'),

  -- Unit 3, Lesson 1: Morning Routine
  (3, 1, 1, 'Wake up', 'Gumising'),
  (3, 1, 2, 'Brush teeth', 'Magsipilyo'),
  (3, 1, 3, 'Take a shower', 'Maligo'),
  (3, 1, 4, 'Eat breakfast', 'Mag-almusal'),
  (3, 1, 5, 'Get dressed', 'Magbihis'),
  (3, 1, 6, 'Go to work', 'Pumasok sa trabaho'),

  -- Unit 3, Lesson 2: Work & School
  (3, 2, 1, 'Work', 'Trabaho'),
  (3, 2, 2, 'School', 'Paaralan'),
  (3, 2, 3, 'Study', 'Mag-aral'),
  (3, 2, 4, 'Teacher', 'Guro'),
  (3, 2, 5, 'Student', 'Estudyante'),
  (3, 2, 6, 'Office', 'Opisina'),

  -- Unit 4, Lesson 1: Basic Foods
  (4, 1, 1, 'Rice', 'Kanin'),
  (4, 1, 2, 'Water', 'Tubig'),
  (4, 1, 3, 'Bread', 'Tinapay'),
  (4, 1, 4, 'Fish', 'Isda'),
  (4, 1, 5, 'Chicken', 'Manok'),
  (4, 1, 6, 'Vegetable', 'Gulay'),
  (4, 1, 7, 'Fruit', 'Prutas'),

  -- Unit 4, Lesson 2: Filipino Dishes
  (4, 2, 1, 'Adobo', 'Adobo'),
  (4, 2, 2, 'Sinigang', 'Sinigang'),
  (4, 2, 3, 'Lechon', 'Lechon'),
  (4, 2, 4, 'Pancit', 'Pancit'),
  (4, 2, 5, 'Lumpia', 'Lumpia'),

  -- Unit 5, Lesson 1: Numbers 1-20
  (5, 1, 1, 'One', 'Isa'),
  (5, 1, 2, 'Two', 'Dalawa'),
  (5, 1, 3, 'Three', 'Tatlo'),
  (5, 1, 4, 'Four', 'Apat'),
  (5, 1, 5, 'Five', 'Lima'),
  (5, 1, 6, 'Six', 'Anim'),
  (5, 1, 7, 'Seven', 'Pito'),
  (5, 1, 8, 'Eight', 'Walo'),
  (5, 1, 9, 'Nine', 'Siyam'),
  (5, 1, 10, 'Ten', 'Sampu'),

  -- Unit 5, Lesson 2: Time Expressions
  (5, 2, 1, 'Today', 'Ngayon'),
  (5, 2, 2, 'Yesterday', 'Kahapon'),
  (5, 2, 3, 'Tomorrow', 'Bukas'),
  (5, 2, 4, 'Morning', 'Umaga'),
  (5, 2, 5, 'Afternoon', 'Hapon'),
  (5, 2, 6, 'Evening', 'Gabi'),
  (5, 2, 7, 'Night', 'Gabi'),

  -- Unit 6, Lesson 1: Basic Colors
  (6, 1, 1, 'Red', 'Pula'),
  (6, 1, 2, 'Blue', 'Asul'),
  (6, 1, 3, 'Green', 'Berde'),
  (6, 1, 4, 'Yellow', 'Dilaw'),
  (6, 1, 5, 'Black', 'Itim'),
  (6, 1, 6, 'White', 'Puti'),
  (6, 1, 7, 'Orange', 'Kahel'),

  -- Unit 6, Lesson 2: Descriptive Words
  (6, 2, 1, 'Big', 'Malaki'),
  (6, 2, 2, 'Small', 'Maliit'),
  (6, 2, 3, 'Good', 'Mabuti'),
  (6, 2, 4, 'Bad', 'Masama'),
  (6, 2, 5, 'Beautiful', 'Maganda'),
  (6, 2, 6, 'Ugly', 'Pangit'),
  (6, 2, 7, 'Hot', 'Mainit'),
  (6, 2, 8, 'Cold', 'Malamig')
) AS q(unit_order, lesson_order, question_order, question, correct_answer)
ON iu."order" = q.unit_order AND il."order" = q.lesson_order;

-- Enable RLS on new tables
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view their own answers" ON user_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON user_answers;
DROP POLICY IF EXISTS "Users can view all units" ON units;
DROP POLICY IF EXISTS "Users can view all lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view all questions" ON questions;

-- RLS policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for user_answers
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

-- Make units, lessons, and questions readable by all authenticated users
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all units"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true); 