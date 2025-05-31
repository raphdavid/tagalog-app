import { useEffect, useState } from 'react';
import { useSupabase } from '../utils/supabase';
import { useAuth } from './useAuth';
import { UserProgress } from '../types/curriculum';

export function useUserProgress() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data);
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getLessonScore = (lessonId: number) => {
    const lessonProgress = progress.find(p => p.lesson_id === lessonId);
    return lessonProgress?.score || 0;
  };

  return {
    progress,
    isLoading,
    isLessonCompleted,
    getLessonScore,
    refreshProgress: fetchProgress
  };
}