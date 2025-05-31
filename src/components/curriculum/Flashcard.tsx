import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../../types/curriculum';

interface FlashcardProps {
  question: Question;
  isRevealed: boolean;
  onReveal: () => void;
  onRate: (isCorrect: boolean) => void;
  hasBeenRated: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  question,
  isRevealed,
  onReveal,
  onRate,
  hasBeenRated,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col">
        {/* Question Side */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  {question.question}
                </h2>
                {!hasBeenRated && (
                  <button
                    onClick={onReveal}
                    className="btn-primary mt-6"
                  >
                    Reveal Answer
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="answer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="text-gray-500 text-sm mb-2">The answer is:</div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {question.correct_answer}
                </h2>
                {!hasBeenRated && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onRate(false)}
                      className="btn-error flex items-center gap-2"
                    >
                      I Missed It ❌
                    </button>
                    <button
                      onClick={() => onRate(true)}
                      className="btn-success flex items-center gap-2"
                    >
                      I Got It ✅
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}; 