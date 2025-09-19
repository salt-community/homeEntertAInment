import { useNavigate } from "@tanstack/react-router";
import QuizCard from "../../components/quiz/QuizCard";
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
      explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
      difficulty: "easy",
      ageGroup: "teen"
    },
    {
      id: "q2", 
      questionText: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswerIndex: 1,
      explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
      difficulty: "easy",
      ageGroup: "teen"
    },
    {
      id: "q3",
      questionText: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correctAnswerIndex: 0,
      explanation: "The speed of light in a vacuum is approximately 299,792,458 meters per second, which is about 300,000 km/s.",
      difficulty: "medium",
      ageGroup: "teen"
    }
  ]
};

export default function Quiz() {
  const navigate = useNavigate();

  const handleRestart = () => {
    // Component will handle its own restart logic
  };

  const handleBackToQuiz = () => {
    navigate({ to: "/quiz" });
  };

  return (
    <QuizCard 
      quiz={mockQuiz}
      onRestart={handleRestart}
      onBackToQuiz={handleBackToQuiz}
    />
  );
}
