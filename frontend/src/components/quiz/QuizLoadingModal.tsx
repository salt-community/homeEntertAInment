import React from "react";

interface QuizLoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export default function QuizLoadingModal({ 
  isOpen, 
  message = "Generating your quiz..." 
}: QuizLoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Animated loading spinner */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Loading message */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Quiz Generation
          </h3>
          <p className="text-gray-600 text-lg">
            {message}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments...
          </p>
        </div>

        {/* Fun facts or tips while waiting */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Did you know?</strong> Our AI is crafting personalized questions just for you based on your preferences!
          </p>
        </div>
      </div>
    </div>
  );
}
