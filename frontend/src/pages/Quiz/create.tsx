import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import QuizConfigurationForm from "../../components/quiz/QuizConfigurationForm";
import QuizLoadingModal from "../../components/quiz/QuizLoadingModal";
import type { QuizConfiguration } from "../../services/quizService";

export default function QuizCreate() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
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

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md mx-auto text-center p-8 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-300 mb-6">
            You need to be signed in to create a quiz. Please sign in to continue.
          </p>
          <SignInButton>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium">
              Sign In
            </button>
          </SignInButton>
          <div className="mt-4">
            <button
              onClick={() => navigate({ to: "/quiz" })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz creation form if user is authenticated
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
