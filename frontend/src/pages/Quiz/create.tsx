import { useNavigate } from "@tanstack/react-router";
import QuizConfigurationForm from "../../components/quiz/QuizConfigurationForm";
import type { QuizConfiguration } from "../../services/quizService";

export default function QuizCreate() {
  const navigate = useNavigate();

  const handleFormSubmit = async (config: QuizConfiguration) => {
    console.log("Quiz configuration submitted:", config);

    try {
      // Import QuizService dynamically to avoid circular dependencies
      const { QuizService } = await import("../../services/quizService");

      // Create the quiz with the configuration
      const response = await QuizService.createQuiz(config);

      if (response.success && response.quiz) {
        // Store the created quiz in sessionStorage
        sessionStorage.setItem("currentQuiz", JSON.stringify(response.quiz));

        // Navigate to the quiz page with the created quiz
        navigate({ to: "/quiz/play" });
      } else {
        console.error("Failed to create quiz:", response.message);
        // TODO: Show error message to user
        navigate({ to: "/quiz" });
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      // TODO: Show error message to user
      navigate({ to: "/quiz" });
    }
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
