import type { QuestionResponse } from "../../services/quizService";

interface QuestionCardProps {
  question: QuestionResponse;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {question.questionText}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
            question.difficulty
          )}`}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
