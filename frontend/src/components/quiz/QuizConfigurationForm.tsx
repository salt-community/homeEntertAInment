import React, { useState } from 'react';

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
    <>
      <style>{sliderStyles}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">🎯 Configure Your Quiz</h3>
            <p className="text-gray-600">Customize your quiz experience</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Age Group */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                👥 Age Group
              </label>
              <select
                value={config.ageGroup}
                onChange={(e) => setConfig(prev => ({ ...prev, ageGroup: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-base"
                required
              >
                <option value="" className="text-gray-500">Select age group</option>
                {AGE_GROUPS.map(group => (
                  <option key={group.value} value={group.value} className="text-gray-900">
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                📚 Topics (Select one or more)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-white">
                {TOPIC_OPTIONS.map(topic => (
                  <label key={topic} className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 p-2 rounded-md transition-colors">
                    <input
                      type="checkbox"
                      checked={config.topics.includes(topic)}
                      onChange={() => handleTopicToggle(topic)}
                      className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{topic}</span>
                  </label>
                ))}
              </div>
              {config.topics.length > 0 && (
                <p className="text-xs text-blue-600 mt-2">
                  {config.topics.length} topic{config.topics.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                ⚡ Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map(level => (
                  <label key={level.value} className="flex flex-col items-center space-y-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.value}
                      checked={config.difficulty === level.value}
                      onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700 text-center">{level.label}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      level.value === 'easy' ? 'bg-green-400' : 
                      level.value === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                🔢 Number of Questions: <span className="text-blue-600 font-bold">{config.questionCount}</span>
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={config.questionCount}
                  onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((config.questionCount - 5) / 10) * 100}%, #e5e7eb ${((config.questionCount - 5) / 10) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="font-medium">5</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🎯 Create Quiz
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}
