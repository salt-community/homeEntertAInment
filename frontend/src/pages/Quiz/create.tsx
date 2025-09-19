import { useNavigate } from "@tanstack/react-router";
import QuizConfigurationForm from "../../components/quiz/QuizConfigurationForm";
import type { QuizConfiguration } from "../../services/quizService";

export default function QuizCreate() {
  const navigate = useNavigate();

  const handleFormSubmit = (config: QuizConfiguration) => {
    console.log("Quiz configuration submitted:", config);
    // TODO: Implement quiz creation with the configuration
    // Navigate back to quiz index or to the created quiz
    navigate({ to: "/quiz" });
  };

  const handleFormCancel = () => {
    navigate({ to: "/quiz" });
  };

  return (
    <div>
      <QuizConfigurationForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
}
