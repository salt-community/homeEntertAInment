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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Quiz Complete!
          </h1>
          <h2 className="text-xl text-gray-700 mb-4">{quiz.title}</h2>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {percentage}%
          </div>
          <div className="text-lg text-gray-600">
            {score} out of {quiz.questions.length} questions correct
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswerIndex;

            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{question.questionText}</p>
                <div className="text-sm text-gray-600">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Retake Quiz
          </button>
          <button
            onClick={onBackToQuiz}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back to Quiz Menu
          </button>
        </div>
      </div>
    </div>
  );
}
