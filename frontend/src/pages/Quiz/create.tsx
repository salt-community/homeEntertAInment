import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import QuizConfigurationForm from "../../components/quiz/QuizConfigurationForm";
import QuizLoadingModal from "../../components/quiz/QuizLoadingModal";
import type { QuizConfiguration } from "../../services/quizService";

export default function QuizCreate() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormSubmit = async (config: QuizConfiguration) => {
    console.log("Quiz configuration submitted:", config);
    setIsGenerating(true);

    try {
      // Import QuizService dynamically to avoid circular dependencies
      const { QuizService } = await import("../../services/quizService");

      // Create the quiz with the configuration
      const response = await QuizService.createQuiz(config);

      if (response.success && response.quiz && response.quizId) {
        // Navigate to the quiz page using the quiz ID
        navigate({ to: "/quiz/play", search: { quizId: response.quizId } });
      } else {
        console.error("Failed to create quiz:", response.message);
        // TODO: Show error message to user
        setIsGenerating(false);
        navigate({ to: "/quiz" });
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      // TODO: Show error message to user
      setIsGenerating(false);
      navigate({ to: "/quiz" });
    }
  };

  const handleFormCancel = () => {
    navigate({ to: "/quiz" });
  };

  return (
    <div>
      <QuizLoadingModal isOpen={isGenerating} />
      <QuizConfigurationForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
}
