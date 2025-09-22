import { useState } from "react";
import type { QuizResponse } from "../../services/quizService";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";

interface QuizCardProps {
  quiz: QuizResponse;
  onRestart?: () => void;
  onBackToQuiz?: () => void;
}

export default function QuizCard({
  quiz,
  onRestart,
  onBackToQuiz,
}: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    onRestart?.();
  };

  const handleBackToQuiz = () => {
    onBackToQuiz?.();
  };

  if (showResults) {
    return (
      <QuizResults
        quiz={quiz}
        selectedAnswers={selectedAnswers}
        onRestart={handleRestart}
        onBackToQuiz={handleBackToQuiz}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <div className="space-y-4">
          {/* Previous and Next buttons on same line */}
          <div className="flex justify-between items-center">
            <div>
              {!isFirstQuestion && (
                <button
                  onClick={handlePrevious}
                  className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  ← Previous
                </button>
              )}
            </div>

            {selectedAnswers[currentQuestionIndex] !== undefined && (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isLastQuestion ? "🎯 Finish Quiz" : "Next →"}
              </button>
            )}
          </div>

          {/* Cancel button below */}
          <div className="flex justify-center">
            <button
              onClick={handleBackToQuiz}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
