import { useEffect, useState, useCallback } from 'react';
import { useSupabase } from '../utils/supabase';
import { Unit, Lesson, Question } from '../types/curriculum';

export function useCurriculum() {
  const { supabase } = useSupabase();
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback units if database is empty or not working
  const fallbackUnits: Unit[] = [
    {
      id: 1,
      title: "Basic Greetings & Introductions",
      description: "Learn essential Tagalog greetings and how to introduce yourself",
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Family & Relationships", 
      description: "Learn words for family members and relationships",
      order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Daily Activities",
      description: "Common words for everyday activities", 
      order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Food & Dining",
      description: "Essential vocabulary for food and eating",
      order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('order');

      if (error) throw error;
      
      // Use database data if available, otherwise fallback
      if (data && data.length > 0) {
        setUnits(data);
      } else {
        console.warn('No units found in database, using fallback data');
        setUnits(fallbackUnits);
      }
    } catch (err: any) {
      console.error('Error fetching units:', err);
      setError(err.message);
      // Use fallback data even on error
      setUnits(fallbackUnits);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize functions to prevent infinite loops
  const fetchLessons = useCallback(async (unitId: number) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('unit_id', unitId)
        .order('order');

      if (error) throw error;
      
      // If we have data, return it
      if (data && data.length > 0) {
        return data;
      }
      
      // Fallback lessons for each unit
      const fallbackLessons: { [key: number]: Lesson[] } = {
        1: [
          {
            id: 1,
            unit_id: 1,
            title: "Common Greetings",
            description: "Essential greetings for daily use",
            order: 1,
            type: "vocabulary",
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            unit_id: 1,
            title: "Polite Expressions", 
            description: "Please, thank you, and other courtesies",
            order: 2,
            type: "vocabulary", 
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        2: [
          {
            id: 4,
            unit_id: 2,
            title: "Immediate Family",
            description: "Parents, siblings, and close family",
            order: 1,
            type: "vocabulary",
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        3: [
          {
            id: 6,
            unit_id: 3,
            title: "Morning Routine",
            description: "Activities you do in the morning",
            order: 1,
            type: "vocabulary",
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        4: [
          {
            id: 8,
            unit_id: 4,
            title: "Basic Foods",
            description: "Common foods and ingredients",
            order: 1,
            type: "vocabulary",
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };
      
      console.warn(`No lessons found in database for unit ${unitId}, using fallback data`);
      return fallbackLessons[unitId] || [];
    } catch (err: any) {
      console.error(`Error fetching lessons for unit ${unitId}:`, err);
      throw err;
    }
  }, [supabase]);

  const fetchLesson = useCallback(async (lessonId: number) => {
    try {
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId);

      if (questionsError) throw questionsError;

      const sortedQuestions = questions.sort((a, b) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;
        if (orderA === orderB) {
          return a.id - b.id;
        }
        return orderA - orderB;
      });

      return { lesson, questions: sortedQuestions };
    } catch (err: any) {
      throw err;
    }
  }, [supabase]);

  const saveProgress = async (userId: string, lessonId: number, score: number) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          score,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err: any) {
      throw err;
    }
  };

  const saveAnswer = async (userId: string, questionId: number, answer: string, isCorrect: boolean) => {
    try {
      const { error } = await supabase
        .from('user_answers')
        .insert({
          user_id: userId,
          question_id: questionId,
          answer,
          is_correct: isCorrect,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    units,
    isLoading,
    error,
    fetchLessons,
    fetchLesson,
    saveProgress,
    saveAnswer
  };
}