import React, { useState } from "react";
import type { QuizConfiguration as QuizConfigType } from "../../services/quizService";
import QuizLoadingModal from "./QuizLoadingModal";

// Custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

interface QuizConfigurationFormProps {
  onSubmit: (config: QuizConfigType) => void;
  onCancel: () => void;
}

const AGE_GROUPS = [
  { value: "children", label: "Children (6-12 years)" },
  { value: "teen", label: "Teen (13-17 years)" },
  { value: "adult", label: "Adult (18+ years)" },
];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const TOPIC_OPTIONS = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Sports",
  "Movies & TV",
  "Music",
  "Literature",
  "Technology",
  "Art & Culture",
  "Food & Cooking",
  "Nature & Animals",
];

export default function QuizConfigurationForm({
  onSubmit,
  onCancel,
}: QuizConfigurationFormProps) {
  const [config, setConfig] = useState<QuizConfigType>({
    ageGroup: "",
    topics: [],
    difficulty: "",
    questionCount: 10,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleTopicToggle = (topic: string) => {
    setConfig((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.ageGroup && config.difficulty && config.topics.length > 0) {
      setIsGenerating(true);
      // The actual quiz creation will be handled by the parent component (create.tsx)
      // This just triggers the loading state and passes the config
      onSubmit(config);
    }
  };

  const isFormValid =
    config.ageGroup && config.difficulty && config.topics.length > 0;

  return (
    <>
      <style>{sliderStyles}</style>
      <QuizLoadingModal isOpen={isGenerating} />
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="rounded-[10px] bg-black p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                Configure Your Quiz
              </h3>
              <p className="text-white/90">Customize your quiz experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Age Group */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <label className="block text-sm font-semibold text-white mb-3">
                  Age Group
                </label>
                <select
                  value={config.ageGroup}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, ageGroup: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:border-[#F930C7] bg-black text-white text-base"
                  required
                >
                  <option value="" className="text-white/70 bg-black">
                    Select age group
                  </option>
                  {AGE_GROUPS.map((group) => (
                    <option
                      key={group.value}
                      value={group.value}
                      className="text-white bg-black"
                    >
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topics */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <label className="block text-sm font-semibold text-white mb-3">
                  Topics (Select one or more)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border-2 border-white/30 rounded-lg p-4 bg-black">
                  {TOPIC_OPTIONS.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={config.topics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className="w-4 h-4 rounded border-2 border-white/30 text-[#F930C7] focus:ring-[#F930C7] focus:ring-2 bg-black"
                      />
                      <span className="text-sm font-medium text-white">
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
                {config.topics.length > 0 && (
                  <p className="text-xs text-[#F930C7] mt-2">
                    {config.topics.length} topic
                    {config.topics.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* Difficulty */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <label className="block text-sm font-semibold text-white mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className="flex flex-col items-center space-y-2 cursor-pointer p-3 border-2 border-white/30 rounded-lg hover:border-[#F930C7] transition-colors"
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level.value}
                        checked={config.difficulty === level.value}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                        className="w-4 h-4 text-[#F930C7] focus:ring-[#F930C7] focus:ring-2"
                      />
                      <span className="text-sm font-medium text-white text-center">
                        {level.label}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          level.value === "easy"
                            ? "bg-green-400"
                            : level.value === "medium"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      ></div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <label className="block text-sm font-semibold text-white mb-3">
                  Number of Questions:{" "}
                  <span className="text-[#F930C7] font-bold">
                    {config.questionCount}
                  </span>
                </label>
                <div className="px-2">
                  <input
                    type="range"
                    min="5"
                    max="15"
                    value={config.questionCount}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        questionCount: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #F930C7 0%, #F930C7 ${
                        ((config.questionCount - 5) / 10) * 100
                      }%, #ffffff20 ${
                        ((config.questionCount - 5) / 10) * 100
                      }%, #ffffff20 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isGenerating}
                  className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isGenerating ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
