import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import NewQuizButton from "../../components/quiz/NewQuizButton";
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
      explanation:
        "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
      difficulty: "easy",
      ageGroup: "teen",
    },
    {
      id: "q2",
      questionText: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswerIndex: 1,
      explanation:
        "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
      difficulty: "easy",
      ageGroup: "teen",
    },
    {
      id: "q3",
      questionText: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correctAnswerIndex: 0,
      explanation:
        "The speed of light in a vacuum is approximately 299,792,458 meters per second, which is about 300,000 km/s.",
      difficulty: "medium",
      ageGroup: "teen",
    },
  ],
};

export default function QuizIndex() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleNewQuiz = () => {
    navigate({ to: "/quiz/create" });
  };

  const handleTakeSampleQuiz = () => {
    // For the sample quiz, we'll still use sessionStorage since it's a mock quiz
    // In a real scenario, you might want to create a sample quiz in the database
    sessionStorage.setItem("currentQuiz", JSON.stringify(mockQuiz));
    navigate({ to: "/quiz/play" });
  };

  const handleViewAllQuizzes = () => {
    navigate({ to: "/quiz/list" });
  };

  const handleMyQuizzes = () => {
    navigate({ to: "/quiz/my-quizzes" });
  };

  return (
    <div
      className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
      style={{ backgroundImage: "url('/landing-bg.png')" }}
    >
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
            Quiz Generator
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Create custom quizzes tailored to your preferences. Turn any topic
            into a game night with fun, challenging, shareable questions.
          </p>
        </div>

        {/* Main three cards in a grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] h-full">
            <div className="rounded-[10px] bg-black p-8 text-center h-full flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                  Create New Quiz
                </h2>
                <p className="text-sm leading-6 text-white/90 mb-6">
                  Build a personalized quiz with custom topics, difficulty levels,
                  and question counts.
                </p>
              </div>
              <NewQuizButton onClick={handleNewQuiz} />
            </div>
          </div>

          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#3076F9] to-[#F930C7] h-full">
            <div className="rounded-[10px] bg-black p-8 text-center h-full flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                  Try Sample Quiz
                </h2>
                <p className="text-sm leading-6 text-white/90 mb-6">
                  Experience our quiz system with a pre-made science quiz to see
                  how it works.
                </p>
              </div>
              <button
                onClick={handleTakeSampleQuiz}
                className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                Start Sample Quiz
              </button>
            </div>
          </div>

          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] h-full">
            <div className="rounded-[10px] bg-black p-8 text-center h-full flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                  Browse All Quizzes
                </h2>
                <p className="text-sm leading-6 text-white/90 mb-6">
                  Explore our collection of available quizzes and find the perfect
                  one for your game night.
                </p>
              </div>
              <button
                onClick={handleViewAllQuizzes}
                className="px-8 py-3 bg-gradient-to-r from-[#3076F9] to-[#F930C7] text-white font-semibold rounded-lg shadow-md hover:from-[#3076F9]/80 hover:to-[#F930C7]/80 focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                View All Quizzes
              </button>
            </div>
          </div>
        </div>

        {/* My Quizzes card centered below */}
        {isSignedIn && (
          <div className="flex justify-center">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div></div> {/* Empty column for centering */}
                <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#3076F9] to-[#F930C7] h-full">
                  <div className="rounded-[10px] bg-black p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                        My Quizzes
                      </h2>
                      <p className="text-sm leading-6 text-white/90 mb-6">
                        View and manage all the quizzes you've created. Access your
                        personal quiz collection.
                      </p>
                    </div>
                    <button
                      onClick={handleMyQuizzes}
                      className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                      View My Quizzes
                    </button>
                  </div>
                </div>
                <div></div> {/* Empty column for centering */}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
