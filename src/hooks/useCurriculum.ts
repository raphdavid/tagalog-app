import { useEffect, useState } from 'react';
import { useSupabase } from '../utils/supabase';
import { Unit, Lesson, Question } from '../types/curriculum';

export function useCurriculum() {
  const { supabase } = useSupabase();
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setUnits(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessons = async (unitId: number) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('unit_id', unitId)
        .order('order');

      if (error) throw error;
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const fetchLesson = async (lessonId: number) => {
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

      // Sort questions by order if available, otherwise by id
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
  };

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