import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUser, useAuth } from "@clerk/clerk-react";
import { QuizService, type QuizListItem } from "../../services/quizService";
import { ShareQuizModal } from "../../components";

export default function MyQuizzes() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    quizId: string;
    quizTitle: string;
  }>({
    isOpen: false,
    quizId: "",
    quizTitle: "",
  });

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      if (!isSignedIn || !user || !isLoaded) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          throw new Error("No authentication token available");
        }

        const userQuizzes = await QuizService.getUserQuizzes(user.id, token);
        setQuizzes(userQuizzes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch your quizzes"
        );
        console.error("Error fetching user quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, [isSignedIn, user, isLoaded, getToken]);

  const handleQuizClick = (quizId: string) => {
    navigate({ to: "/quiz/play", search: { quizId } });
  };

  const handleBackToIndex = () => {
    navigate({ to: "/quiz" });
  };

  const handleShareQuiz = (
    e: React.MouseEvent,
    quizId: string,
    quizTitle: string
  ) => {
    e.stopPropagation();
    setShareModal({
      isOpen: true,
      quizId,
      quizTitle,
    });
  };

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      quizId: "",
      quizTitle: "",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAgeGroupColor = (ageGroup: string) => {
    switch (ageGroup.toLowerCase()) {
      case "child":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "teen":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "adult":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
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
                    You need to be signed in to view your quizzes.
                  </p>
                  <button
                    onClick={() => navigate({ to: "/quiz" })}
                    className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                  >
                    Back to Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
      style={{ backgroundImage: "url('/landing-bg.png')" }}
    >
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
            My Quizzes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            View and manage all the quizzes you've created.
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={handleBackToIndex}
            className="px-6 py-3 bg-gradient-to-r from-[#3076F9] to-[#F930C7] text-white font-semibold rounded-lg shadow-md hover:from-[#3076F9]/80 hover:to-[#F930C7]/80 focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            ← Back to Quiz
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div className="text-white text-lg">Loading your quizzes...</div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Error: {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="text-center">
            <div className="text-white/70 text-lg mb-6">
              You haven't created any quizzes yet.
            </div>
            <button
              onClick={() => navigate({ to: "/quiz/create" })}
              className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Create Your First Quiz
            </button>
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 transition-all duration-200 cursor-pointer transform hover:scale-105"
                onClick={() => handleQuizClick(quiz.id)}
              >
                <div className="rounded-[10px] bg-black p-6 text-left h-full">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {quiz.title}
                  </h3>

                  <p className="text-sm text-white/80 mb-4 line-clamp-3">
                    {quiz.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getAgeGroupColor(
                        quiz.ageGroup
                      )}`}
                    >
                      {quiz.ageGroup}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-white/60 mb-1">Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {quiz.topics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded"
                        >
                          {topic}
                        </span>
                      ))}
                      {quiz.topics.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                          +{quiz.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span>{quiz.questionCount} questions</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleShareQuiz(e, quiz.id, quiz.title)}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                        title="Share quiz"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </button>
                      <span className="text-[#F930C7] font-medium">
                        Play Quiz →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ShareQuizModal
          isOpen={shareModal.isOpen}
          onClose={closeShareModal}
          quizId={shareModal.quizId}
          quizTitle={shareModal.quizTitle}
        />
      </section>
    </div>
  );
}
