import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QuizCard from "../../components/quiz/QuizCard";
import type { QuizResponse } from "../../services/quizService";

export default function Quiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);

  // Get quiz data from sessionStorage
  useEffect(() => {
    const storedQuiz = sessionStorage.getItem('currentQuiz');
    if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz) as QuizResponse;
        setQuiz(parsedQuiz);
      } catch (error) {
        console.error('Error parsing quiz data:', error);
        setQuiz(null);
      }
    }
  }, []);

  const handleRestart = () => {
    // Component will handle its own restart logic
  };

  const handleBackToQuiz = () => {
    // Clear the stored quiz data when navigating back
    sessionStorage.removeItem('currentQuiz');
    navigate({ to: "/quiz" });
  };

  // Show loading state while quiz data is being retrieved
  if (quiz === null) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // If no quiz data is provided, show error or redirect
  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Quiz Data Available
          </h1>
          <p className="text-gray-600 mb-6">
            Please select a quiz from the quiz menu.
          </p>
          <button
            onClick={handleBackToQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
          >
            ← Back to Quiz Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizCard
      quiz={quiz}
      onRestart={handleRestart}
      onBackToQuiz={handleBackToQuiz}
    />
  );
}
