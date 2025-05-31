import React, { useState } from 'react';
import { Question } from '../../types/curriculum';
import { Check, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  isAnswered: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSubmit = () => {
    const isCorrect = selectedAnswer === question.correct_answer;
    onAnswer(selectedAnswer, isCorrect);
    setShowExplanation(true);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'vocabulary':
        return (
          <div>
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type the English translation..."
              className="input w-full"
            />
            {isAnswered && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
                  ? 'bg-success-50 text-success-700'
                  : 'bg-error-50 text-error-700'
              }`}>
                <p>Correct answer: {question.correct_answer}</p>
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => !isAnswered && setSelectedAnswer(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-lg border text-left transition ${
                  selectedAnswer === option
                    ? isAnswered
                      ? option === question.correct_answer
                        ? 'border-success-500 bg-success-50'
                        : 'border-error-500 bg-error-50'
                      : 'border-primary-500 bg-primary-50'
                    : isAnswered && option === question.correct_answer
                    ? 'border-success-500 bg-success-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && (
                    option === question.correct_answer ? (
                      <Check className="text-success-500" />
                    ) : selectedAnswer === option ? (
                      <X className="text-error-500" />
                    ) : null
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'text_input':
        return (
          <div>
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer here..."
              className="input w-full"
            />
            {isAnswered && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedAnswer === question.correct_answer
                  ? 'bg-success-50 text-success-700'
                  : 'bg-error-50 text-error-700'
              }`}>
                <p>Correct answer: {question.correct_answer}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      
      <div className="mb-6">
        {renderQuestion()}
      </div>

      {!isAnswered && (
        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer}
          className="btn-primary w-full"
        >
          Submit Answer
        </button>
      )}

      {isAnswered && question.explanation && (
        <div className="mt-4 p-4 bg-accent-blue-light rounded-lg">
          <p className="font-medium mb-2">Explanation:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};