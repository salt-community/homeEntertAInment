import React, { useState } from 'react';

interface QuizConfiguration {
  ageGroup: string;
  topics: string[];
  difficulty: string;
  questionCount: number;
}

interface QuizConfigurationFormProps {
  onSubmit: (config: QuizConfiguration) => void;
  onCancel: () => void;
}

const AGE_GROUPS = [
  { value: 'children', label: 'Children (6-12 years)' },
  { value: 'teen', label: 'Teen (13-17 years)' },
  { value: 'adult', label: 'Adult (18+ years)' },
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const TOPIC_OPTIONS = [
  'General Knowledge',
  'Science',
  'History',
  'Geography',
  'Sports',
  'Movies & TV',
  'Music',
  'Literature',
  'Technology',
  'Art & Culture',
  'Food & Cooking',
  'Nature & Animals',
];

export default function QuizConfigurationForm({ onSubmit, onCancel }: QuizConfigurationFormProps) {
  const [config, setConfig] = useState<QuizConfiguration>({
    ageGroup: '',
    topics: [],
    difficulty: '',
    questionCount: 10,
  });

  const handleTopicToggle = (topic: string) => {
    setConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.ageGroup && config.difficulty && config.topics.length > 0) {
      onSubmit(config);
    }
  };

  const isFormValid = config.ageGroup && config.difficulty && config.topics.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Configure Your Quiz</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={config.ageGroup}
                onChange={(e) => setConfig(prev => ({ ...prev, ageGroup: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select age group</option>
                {AGE_GROUPS.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics (Select one or more)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                {TOPIC_OPTIONS.map(topic => (
                  <label key={topic} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.topics.includes(topic)}
                      onChange={() => handleTopicToggle(topic)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {DIFFICULTY_LEVELS.map(level => (
                  <label key={level.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.value}
                      checked={config.difficulty === level.value}
                      onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions: {config.questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="15"
                value={config.questionCount}
                onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>15</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
