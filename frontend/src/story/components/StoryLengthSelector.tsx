import type { StoryLengthValue } from "../types";

interface StoryLengthSelectorProps {
  selected: StoryLengthValue | "";
  onChange: (value: StoryLengthValue) => void;
  disabled?: boolean;
  error?: string;
}

const STORY_LENGTH_OPTIONS = [
  {
    value: "short" as const,
    label: "Short",
    wordCount: "~500 words",
    icon: (
      <div className="flex flex-col space-y-1">
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
      </div>
    ),
  },
  {
    value: "medium" as const,
    label: "Medium",
    wordCount: "~1000 words",
    icon: (
      <div className="flex flex-col space-y-1">
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
      </div>
    ),
  },
  {
    value: "full" as const,
    label: "Full",
    wordCount: "~1500 words",
    icon: (
      <div className="flex flex-col space-y-1">
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
      </div>
    ),
  },
];

export default function StoryLengthSelector({
  selected,
  onChange,
  disabled = false,
  error,
}: StoryLengthSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-2">Story Length *</label>

      <div className="grid grid-cols-3 gap-3">
        {STORY_LENGTH_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={`
              rounded-lg transition-all duration-300
              ${
                selected === option.value
                  ? "p-[3px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/25"
                  : "p-0"
              }
              ${!disabled ? "hover:scale-105 hover:-translate-y-1" : ""}
            `}
          >
            <label
              className={`
                flex flex-col items-center justify-center cursor-pointer p-6 
                rounded-lg bg-black transition-all duration-300 h-24 w-full
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
                ${
                  selected === option.value
                    ? "border-0"
                    : "border-2 border-gray-600 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-400/25"
                }
              `}
              title={`${option.label} - ${option.wordCount}`}
            >
              <input
                type="radio"
                name="storyLength"
                value={option.value}
                checked={selected === option.value}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className="sr-only"
              />

              <div className="flex items-center justify-center h-full">
                {option.icon}
              </div>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
