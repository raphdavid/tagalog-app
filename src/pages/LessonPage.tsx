import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurriculum } from '../hooks/useCurriculum';
import { Question as QuestionType, Lesson } from '../types/curriculum';
import { QuestionCard } from '../components/curriculum/QuestionCard';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchLesson, saveProgress, saveAnswer } = useCurriculum();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { lesson: lessonData, questions: questionData } = await fetchLesson(parseInt(id, 10));
        setLesson(lessonData);
        setQuestions(questionData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [id, fetchLesson]);

  const handleAnswer = async (answer: string, isCorrect: boolean) => {
    if (!user || !lesson) return;

    try {
      // Save the answer
      await saveAnswer(
        user.id,
        questions[currentQuestionIndex].id,
        answer,
        isCorrect
      );

      // Update local state
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: isCorrect
      }));

      // If this was the last question, save progress
      if (currentQuestionIndex === questions.length - 1) {
        const correctAnswers = Object.values(answers).filter(Boolean).length + (isCorrect ? 1 : 0);
        const score = Math.round((correctAnswers / questions.length) * 100);
        
        await saveProgress(user.id, lesson.id, score);
        setTimeout(() => setShowCelebration(true), 1000);
      }
    } catch (err) {
      console.error('Error saving answer:', err);
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
        <p>Error loading lesson: {error || 'Lesson not found'}</p>
        <Link to="/dashboard" className="text-error-700 underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (showCelebration) {
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
            Congratulations!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8"
          >
            You've completed the lesson and earned {
              Math.round((Object.values(answers).filter(Boolean).length / questions.length) * 100)
            }%!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={`/unit/${lesson.unit_id}`} className="btn-secondary">
              Back to Unit
            </Link>
            <Link to="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 mb-8">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            isAnswered={currentQuestionIndex in answers}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-auto flex justify-between">
        <button 
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-1 px-4 py-2 rounded ${
            currentQuestionIndex === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        
        {currentQuestionIndex in answers && (
          <button 
            onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              }
            }}
            className="btn-primary flex items-center gap-1"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPage;