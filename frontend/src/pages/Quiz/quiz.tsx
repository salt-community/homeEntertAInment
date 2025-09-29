import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QuizCard from "../../components/quiz/QuizCard";
import { QuizService, type QuizResponse } from "../../services/quizService";

export default function Quiz() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/quiz/play" });
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz data based on quizId from URL or fallback to sessionStorage
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        if (search.quizId) {
          // Fetch quiz by ID from backend
          console.log("Fetching quiz with ID:", search.quizId);
          const fetchedQuiz = await QuizService.getQuiz(search.quizId);
          setQuiz(fetchedQuiz);
        } else {
          // Fallback to sessionStorage for backward compatibility
          const storedQuiz = sessionStorage.getItem("currentQuiz");
          if (storedQuiz) {
            try {
              const parsedQuiz = JSON.parse(storedQuiz) as QuizResponse;
              setQuiz(parsedQuiz);
            } catch (error) {
              console.error("Error parsing quiz data:", error);
              setError("Failed to load quiz data");
            }
          } else {
            setError("No quiz ID provided and no quiz data found");
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [search.quizId]);

  const handleRestart = () => {
    // Component will handle its own restart logic
  };

  const handleBackToQuiz = () => {
    // Clear the stored quiz data when navigating back
    sessionStorage.removeItem("currentQuiz");
    navigate({ to: "/quiz" });
  };

  // Show loading state while quiz data is being retrieved
  if (loading) {
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

  // Show error state if there was an error loading the quiz
  if (error || !quiz) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                {error ? "Error Loading Quiz" : "No Quiz Data Available"}
              </h1>
              <p className="text-white/90 mb-6">
                {error || "Please select a quiz from the quiz menu."}
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
