import { useState } from "react";

interface QuizSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
  isPrivate: boolean;
  onPrivacyToggle: (quizId: string, isPrivate: boolean) => void;
}

export default function QuizSettingsModal({
  isOpen,
  onClose,
  quizId,
  quizTitle,
  isPrivate,
  onPrivacyToggle,
}: QuizSettingsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handlePrivacyToggle = async () => {
    setIsUpdating(true);
    try {
      await onPrivacyToggle(quizId, !isPrivate);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl border border-white/20 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Quiz Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">{quizTitle}</h3>
            <p className="text-sm text-white/70">
              Manage your quiz settings and privacy options.
            </p>
          </div>

          {/* Privacy Setting */}
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Privacy Setting
                  </h4>
                  <p className="text-xs text-white/70">
                    {isPrivate
                      ? "This quiz is private and won't appear in the public quiz list."
                      : "This quiz is public and visible to everyone in the quiz list."}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${
                      isPrivate ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isPrivate ? "Private" : "Public"}
                  </span>
                  <button
                    onClick={handlePrivacyToggle}
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isPrivate
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isUpdating
                      ? "Updating..."
                      : isPrivate
                      ? "Make Public"
                      : "Make Private"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black font-medium transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
