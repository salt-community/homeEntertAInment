import type { QuizResponse } from "../../services/quizService";

interface QuizResultsProps {
  quiz: QuizResponse;
  selectedAnswers: number[];
  onRestart: () => void;
  onBackToQuiz: () => void;
}

export default function QuizResults({
  quiz,
  selectedAnswers,
  onRestart,
  onBackToQuiz,
}: QuizResultsProps) {
  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <div
      className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
      style={{ backgroundImage: "url('/landing-bg.png')" }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
          <div className="rounded-[10px] bg-black p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Quiz Complete!
              </h1>
              <h2 className="text-xl text-white/90 mb-4">{quiz.title}</h2>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-[#F930C7] mb-2">
                {percentage}%
              </div>
              <div className="text-lg text-white/90">
                {score} out of {quiz.questions.length} questions correct
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswerIndex;

                return (
                  <div
                    key={question.id}
                    className="border border-white/20 rounded-lg p-4 bg-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">
                        Question {index + 1}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          isCorrect
                            ? "bg-green-400/20 text-green-400 border border-green-400/30"
                            : "bg-red-400/20 text-red-400 border border-red-400/30"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-white/90 mb-2">
                      {question.questionText}
                    </p>
                    <div className="text-sm text-white/80">
                      <p>
                        <strong>Your answer:</strong>{" "}
                        {question.options[userAnswer] || "No answer"}
                      </p>
                      <p>
                        <strong>Correct answer:</strong>{" "}
                        {question.options[question.correctAnswerIndex]}
                      </p>
                      <p>
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onRestart}
                className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBackToQuiz}
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back to Quiz Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
