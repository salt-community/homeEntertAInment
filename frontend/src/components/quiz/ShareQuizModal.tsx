interface ShareQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
}

export default function ShareQuizModal({
  isOpen,
  onClose,
  quizId,
  quizTitle,
}: ShareQuizModalProps) {
  if (!isOpen) return null;

  const quizUrl = `${window.location.origin}/quiz/play?quizId=${quizId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      // You could add a toast notification here
      alert("Quiz link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Share Quiz</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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

        <div className="mb-4">
          <p className="text-white/80 text-sm mb-2">Quiz: {quizTitle}</p>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <p className="text-white/90 text-sm break-all">{quizUrl}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 transition-all duration-200"
          >
            Copy Link
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
