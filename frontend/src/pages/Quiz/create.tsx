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
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-white text-lg">Loading...</div>
          </div>
        </section>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md mx-auto">
              <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
                <div className="rounded-[10px] bg-black p-8 text-center">
                  <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                    Sign In Required
                  </h2>
                  <p className="text-sm leading-6 text-white/90 mb-6">
                    You need to be signed in to create a quiz. Please sign in to
                    continue.
                  </p>
                  <SignInButton>
                    <button className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
                      Sign In
                    </button>
                  </SignInButton>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate({ to: "/quiz" })}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      ← Back to Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
