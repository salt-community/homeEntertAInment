import { useState } from "react";
import type { QuizResponse, QuestionResponse } from "../../services/quizService";

interface QuizCardProps {
  quiz: QuizResponse;
  onRestart?: () => void;
  onBackToQuiz?: () => void;
}

export default function QuizCard({ quiz, onRestart, onBackToQuiz }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
      setQuizCompleted(true);
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
    setQuizCompleted(false);
    onRestart?.();
  };

  const handleBackToQuiz = () => {
    onBackToQuiz?.();
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Quiz Complete!</h1>
            <h2 className="text-xl text-gray-700 mb-4">{quiz.title}</h2>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <div className="text-lg text-gray-600">
              {score} out of {quiz.questions.length} questions correct
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswerIndex;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{question.questionText}</p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Your answer:</strong> {question.options[userAnswer] || 'No answer'}</p>
                    <p><strong>Correct answer:</strong> {question.options[question.correctAnswerIndex]}</p>
                    <p><strong>Explanation:</strong> {question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={handleBackToQuiz}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back to Quiz Menu
            </button>
          </div>
        </div>
      </div>
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
            <div className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.questionText}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </span>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
