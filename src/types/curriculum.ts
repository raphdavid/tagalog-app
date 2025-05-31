export interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  unit_id: number;
  title: string;
  description: string;
  order: number;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'quiz';
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  lesson_id: number;
  type: 'multiple_choice' | 'text_input' | 'matching' | 'vocabulary';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  user_id: string;
  lesson_id: number;
  completed: boolean;
  score?: number;
  completed_at: string;
}

export interface UserAnswer {
  user_id: string;
  question_id: number;
  answer: string;
  is_correct: boolean;
  created_at: string;
}