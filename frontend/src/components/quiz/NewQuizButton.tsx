interface NewQuizButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function NewQuizButton({
  onClick,
  disabled = false,
  className = "",
}: NewQuizButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 
        bg-gradient-to-r from-[#F930C7] to-[#3076F9] 
        text-white font-semibold 
        rounded-lg shadow-md 
        hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 
        focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black
        disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      Create New Quiz
    </button>
  );
}
