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
        <h2 className="text-xl font-semibold text-white">
          {question.questionText}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            question.difficulty === "easy"
              ? "text-green-400 bg-green-400/20 border border-green-400/30"
              : question.difficulty === "medium"
              ? "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30"
              : "text-red-400 bg-red-400/20 border border-red-400/30"
          }`}
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
                ? "border-[#F930C7] bg-[#F930C7]/10"
                : "border-white/30 hover:border-white/50 hover:bg-white/5"
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="w-4 h-4 text-[#F930C7] focus:ring-[#F930C7] bg-black border-white/30"
            />
            <span className="ml-3 text-white">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
