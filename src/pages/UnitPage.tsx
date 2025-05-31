import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Check, Lock, PlayCircle, MessageCircle, 
  ClipboardList, Music, Lightbulb, Loader2
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useCurriculum } from '../hooks/useCurriculum';
import { useUserProgress } from '../hooks/useUserProgress';
import { Lesson } from '../types/curriculum';
import { TarsierIcon } from '../components/icons/TarsierIcon';

const UnitPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tier } = useSubscription();
  const { units, fetchLessons, isLoading: unitsLoading } = useCurriculum();
  const { isLessonCompleted } = useUserProgress();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const unitId = parseInt(id || '1', 10);
  const unit = units.find(u => u.id === unitId);

  useEffect(() => {
    const loadLessons = async () => {
      if (!unitId) return;
      
      try {
        setIsLoading(true);
        const lessonData = await fetchLessons(unitId);
        setLessons(lessonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [unitId, fetchLessons]);

  const getLessonIcon = (type: string) => {
    switch(type) {
      case 'vocabulary': return <BookOpen size={18} />;
      case 'conversation': return <MessageCircle size={18} />;
      case 'grammar': return <ClipboardList size={18} />;
      case 'culture': return <Lightbulb size={18} />;
      case 'quiz': return <PlayCircle size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const lessonIsAccessible = (lesson: Lesson) => {
    if (!lesson.is_premium) return true;
    return tier === 'premium' || tier === 'basic';
  };

  if (unitsLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-lg">
        <p>Error loading unit: {error}</p>
        <Link to="/dashboard" className="text-error-700 underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Unit not found</h2>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const completedLessons = lessons.filter(l => isLessonCompleted(l.id)).length;
  const progressPercent = (completedLessons / lessons.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Unit {unit.id}: {unit.title}</h1>
        <p className="text-gray-600 mt-2">{unit.description}</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Your Progress</h3>
          <span className="text-sm font-medium">{completedLessons}/{lessons.length} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <motion.div 
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`card overflow-hidden ${
              !lessonIsAccessible(lesson) ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-center justify-between p-5 border-l-4 border-primary-500">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isLessonCompleted(lesson.id) ? (
                    <div className="bg-success-50 p-2 rounded-full">
                      <Check size={20} className="text-success-500" />
                    </div>
                  ) : (
                    <div className="bg-primary-50 p-2 rounded-full">
                      {getLessonIcon(lesson.type)}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">
                    Lesson {lesson.id}: {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded capitalize">
                      {lesson.type}
                    </span>
                    
                    {lesson.is_premium && (
                      <span className="bg-accent-peach text-gray-800 text-xs px-2 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                {lessonIsAccessible(lesson) ? (
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/flashcards/${lesson.id}`}
                      className="btn-secondary flex items-center gap-2 hover:bg-primary-50"
                    >
                      <TarsierIcon size={16} className="text-primary-600" />
                      Flashcards
                    </Link>
                    <Link 
                      to={`/lesson/${lesson.id}`}
                      className={`btn ${isLessonCompleted(lesson.id) ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'btn-primary'}`}
                    >
                      {isLessonCompleted(lesson.id) ? 'Review' : 'Start'}
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-gray-500" />
                    <Link to="/subscribe" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Upgrade to Unlock
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UnitPage;