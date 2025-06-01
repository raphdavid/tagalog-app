import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurriculum } from '../hooks/useCurriculum';
import { Question, Lesson } from '../types/curriculum';
import { Flashcard } from '../components/curriculum/Flashcard';

const FlashcardGamePage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchLesson, saveProgress, saveAnswer } = useCurriculum();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scores, setScores] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fallback data if database isn't available
  const mockVocabulary = [
    { id: 1, question: "Hello", correct_answer: "Kumusta", type: "vocabulary" },
    { id: 2, question: "Thank you", correct_answer: "Salamat", type: "vocabulary" },
    { id: 3, question: "Good morning", correct_answer: "Magandang umaga", type: "vocabulary" },
    { id: 4, question: "Yes", correct_answer: "Oo", type: "vocabulary" },
    { id: 5, question: "No", correct_answer: "Hindi", type: "vocabulary" },
  ];

  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading lesson with ID:', lessonId);
        
        const { lesson: lessonData, questions: questionData } = await fetchLesson(parseInt(lessonId, 10));
        
        console.log('Lesson data:', lessonData);
        console.log('Questions data:', questionData);
        
        const vocabularyQuestions = questionData.filter(q => q.type === 'vocabulary');
        
        setLesson(lessonData);
        setQuestions(vocabularyQuestions);
      } catch (err: any) {
        console.error('Error loading lesson:', err);
        console.log('Using fallback vocabulary data');
        
        // Use fallback data
        setLesson({
          id: parseInt(lessonId, 10),
          unit_id: 1,
          title: "Basic Vocabulary",
          description: "Learn essential Tagalog words",
          order: 1,
          type: "vocabulary",
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setQuestions(mockVocabulary as any);
      } finally {
        setIsLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Lesson loading timed out, using fallback data');
        setLesson({
          id: parseInt(lessonId || '1', 10),
          unit_id: 1,
          title: "Basic Vocabulary",
          description: "Learn essential Tagalog words",
          order: 1,
          type: "vocabulary",
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setQuestions(mockVocabulary as any);
        setIsLoading(false);
      }
    }, 3000); // Reduced to 3 seconds

    loadLesson();

    return () => clearTimeout(timeoutId);
  }, [lessonId]); // Removed fetchLesson dependency to prevent infinite loop

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRate = async (isCorrect: boolean) => {
    console.log('Handle rate called:', isCorrect);
    
    if (!lesson) return;

    // Update local state immediately (don't wait for database)
    setScores(prev => ({
      ...prev,
      [currentIndex]: isCorrect
    }));

    // Try to save to database if user exists, but don't block on it
    if (user) {
      try {
        const currentQuestion = questions[currentIndex];
        
        // Try to save the answer (but don't wait or block on failure)
        saveAnswer(
          user.id,
          currentQuestion.id,
          currentQuestion.correct_answer,
          isCorrect
        ).catch(error => {
          console.warn('Could not save answer to database:', error);
        });

        // If this is the last question, try to save progress
        if (currentIndex === questions.length - 1) {
          const correctAnswers = Object.values(scores).filter(Boolean).length + (isCorrect ? 1 : 0);
          const score = Math.round((correctAnswers / questions.length) * 100);
          
          saveProgress(user.id, lesson.id, score).catch(error => {
            console.warn('Could not save progress to database:', error);
          });
        }
      } catch (err) {
        console.warn('Database operations failed:', err);
      }
    }

    // Handle UI transitions
    if (currentIndex === questions.length - 1) {
      // Show celebration after a short delay
      setTimeout(() => setShowCelebration(true), 1000);
    } else {
      // Move to next question after a short delay
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-lg">
        <p>Error loading flashcards: {error || 'Lesson not found'}</p>
        <Link to="/dashboard" className="text-error-700 underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (showCelebration) {
    const correctCount = Object.values(scores).filter(Boolean).length;
    const totalScore = Math.round((correctCount / questions.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div className="text-center max-w-md">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Award size={64} className="text-primary-600" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4"
          >
            Great Job!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8"
          >
            You got {correctCount} out of {questions.length} cards correct ({totalScore}%)!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setScores({});
                setIsRevealed(false);
                setShowCelebration(false);
              }}
              className="btn-secondary"
            >
              Try Again
            </button>
            <Link to={`/unit/${lesson.unit_id}`} className="btn-primary">
              Back to Unit
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Flashcards Available</h2>
        <p className="text-gray-600 mb-6">This lesson doesn't have any vocabulary cards to review.</p>
        <Link to={`/unit/${lesson.unit_id}`} className="btn-primary">
          Back to Unit
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 mb-8">
        <div className="flex items-center justify-between">
          <Link to={`/unit/${lesson.unit_id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span>Back to Unit</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            Card {currentIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 mb-8 px-4">
        <Flashcard
          question={currentQuestion}
          isRevealed={isRevealed}
          onReveal={handleReveal}
          onRate={handleRate}
          hasBeenRated={currentIndex in scores}
        />
      </div>
    </div>
  );
};

export default FlashcardGamePage; 