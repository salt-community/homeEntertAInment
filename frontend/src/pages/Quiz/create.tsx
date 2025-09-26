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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login Required
            </h1>
            <p className="text-gray-600">
              You need to be logged in to create quizzes. Please sign in to continue.
            </p>
          </div>
          
          <div className="space-y-4">
            <SignInButton>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium">
                Sign In to Create Quiz
              </button>
            </SignInButton>
            
            <button
              onClick={() => navigate({ to: "/quiz" })}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors font-medium"
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show the quiz creation form for authenticated users
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
