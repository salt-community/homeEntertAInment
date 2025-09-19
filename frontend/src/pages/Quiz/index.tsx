import { useNavigate } from "@tanstack/react-router";
import NewQuizButton from "../../components/quiz/NewQuizButton";

export default function QuizIndex() {
  const navigate = useNavigate();

  const handleNewQuiz = () => {
    navigate({ to: "/quiz/create" });
  };

  return (
    <div>
      <h2>Quiz Generator</h2>
      <p>Create custom quizzes tailored to your preferences.</p>
      <div className="mt-4">
        <NewQuizButton onClick={handleNewQuiz} />
      </div>
    </div>
  );
}
