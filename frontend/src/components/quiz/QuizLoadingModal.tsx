interface QuizLoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export default function QuizLoadingModal({
  isOpen,
  message = "Generating your quiz...",
}: QuizLoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] max-w-md w-full">
        <div className="rounded-[10px] bg-black p-8 text-center">
          {/* Animated loading spinner */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin mx-auto"></div>
              <div className="w-16 h-16 border-4 border-[#F930C7] border-t-transparent rounded-full animate-spin mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Loading message */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              Quiz Generation
            </h3>
            <p className="text-white/90 text-lg">{message}</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#F930C7] to-[#3076F9] h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-sm text-white/70 mt-2">
              This may take a few moments...
            </p>
          </div>

          {/* Fun facts or tips while waiting */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-sm text-white">
              <strong>Did you know?</strong> Our AI is crafting personalized
              questions just for you based on your preferences!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
