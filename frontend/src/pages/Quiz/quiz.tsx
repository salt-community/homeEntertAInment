import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QuizCard from "../../components/quiz/QuizCard";
import type { QuizResponse } from "../../services/quizService";

export default function Quiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);

  // Get quiz data from sessionStorage
  useEffect(() => {
    const storedQuiz = sessionStorage.getItem("currentQuiz");
    if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz) as QuizResponse;
        setQuiz(parsedQuiz);
      } catch (error) {
        console.error("Error parsing quiz data:", error);
        setQuiz(null);
      }
    }
  }, []);

  const handleRestart = () => {
    // Component will handle its own restart logic
  };

  const handleBackToQuiz = () => {
    // Clear the stored quiz data when navigating back
    sessionStorage.removeItem("currentQuiz");
    navigate({ to: "/quiz" });
  };

  // Show loading state while quiz data is being retrieved
  if (quiz === null) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F930C7] mx-auto mb-4"></div>
              <p className="text-white">Loading quiz...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no quiz data is provided, show error or redirect
  if (!quiz) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                No Quiz Data Available
              </h1>
              <p className="text-white/90 mb-6">
                Please select a quiz from the quiz menu.
              </p>
              <button
                onClick={handleBackToQuiz}
                className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                ← Back to Quiz Menu
              </button>
            </div>
          </div>
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
