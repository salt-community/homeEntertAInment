import { useNavigate } from "@tanstack/react-router";
import NewQuizButton from "../../components/quiz/NewQuizButton";

export default function QuizIndex() {
  const navigate = useNavigate();

  const handleNewQuiz = () => {
    navigate({ to: "/quiz/create" });
  };

  const handleTakeSampleQuiz = () => {
    navigate({ to: "/quiz/card" });
  };

  return (
    <div>
      <h2>Quiz Generator</h2>
      <p>Create custom quizzes tailored to your preferences.</p>
      <div className="mt-4 space-y-4">
        <NewQuizButton onClick={handleNewQuiz} />
        <div className="mt-4">
          <button
            onClick={handleTakeSampleQuiz}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            🧪 Try Sample Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
