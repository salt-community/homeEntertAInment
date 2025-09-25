import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { QuizService, type QuizListItem } from "../../services/quizService";
import { ShareQuizModal } from "../../components";

export default function QuizList() {
  const navigate = useNavigate();
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
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const quizList = await QuizService.getAllQuizzes();
        setQuizzes(quizList);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch quizzes"
        );
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

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
    e.stopPropagation(); // Prevent triggering the quiz click
    setShareModal({
      isOpen: true,
      quizId,
      quizTitle,
    });
  };

  const handleCloseShareModal = () => {
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

  if (loading) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">
              Error loading quizzes
            </div>
            <div className="text-white/70 mb-6">{error}</div>
            <button
              onClick={handleBackToIndex}
              className="px-6 py-2 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 transition-all duration-200"
            >
              Back to Quiz Index
            </button>
          </div>
        </div>
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
            All Quizzes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Browse and play from our collection of available quizzes
          </p>
          <button
            onClick={handleBackToIndex}
            className="px-6 py-2 bg-gradient-to-r from-[#3076F9] to-[#F930C7] text-white font-semibold rounded-lg hover:from-[#3076F9]/80 hover:to-[#F930C7]/80 transition-all duration-200"
          >
            Back to Quiz Index
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center">
            <div className="text-white/70 text-xl mb-6">
              No quizzes available yet
            </div>
            <button
              onClick={handleBackToIndex}
              className="px-6 py-2 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 transition-all duration-200"
            >
              Create Your First Quiz
            </button>
          </div>
        ) : (
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
      </section>

      <ShareQuizModal
        isOpen={shareModal.isOpen}
        onClose={handleCloseShareModal}
        quizId={shareModal.quizId}
        quizTitle={shareModal.quizTitle}
      />
    </div>
  );
}
