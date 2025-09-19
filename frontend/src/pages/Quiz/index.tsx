import { useNavigate } from "@tanstack/react-router";
import NewQuizButton from "../../components/quiz/NewQuizButton";
import type { QuizResponse } from "../../services/quizService";

// Mock quiz data for testing
const mockQuiz: QuizResponse = {
  id: "mock-quiz-1",
  title: "Sample Science Quiz",
  description: "A fun quiz about basic science concepts",
  ageGroup: "teen",
  topics: ["Science", "General Knowledge"],
  difficulty: "medium",
  questions: [
    {
      id: "q1",
      questionText: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswerIndex: 0,
      explanation:
        "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
      difficulty: "easy",
      ageGroup: "teen",
    },
    {
      id: "q2",
      questionText: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswerIndex: 1,
      explanation:
        "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
      difficulty: "easy",
      ageGroup: "teen",
    },
    {
      id: "q3",
      questionText: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correctAnswerIndex: 0,
      explanation:
        "The speed of light in a vacuum is approximately 299,792,458 meters per second, which is about 300,000 km/s.",
      difficulty: "medium",
      ageGroup: "teen",
    },
  ],
};

export default function QuizIndex() {
  const navigate = useNavigate();

  const handleNewQuiz = () => {
    navigate({ to: "/quiz/create" });
  };

  const handleTakeSampleQuiz = () => {
    // Store quiz data in sessionStorage for the quiz page to retrieve
    sessionStorage.setItem("currentQuiz", JSON.stringify(mockQuiz));
    navigate({ to: "/quiz/quiz" });
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
