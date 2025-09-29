import { useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ResponsiveBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveBackground({
  children,
  className = "",
}: ResponsiveBackgroundProps) {
  const { isSignedIn } = useUser();

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden ${className}`}
    >
      {/* Dynamic Background based on authentication state */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

        {/* Authentication state overlay */}
        {isSignedIn ? (
          // Signed in: Subtle animated gradient
          <div className="absolute inset-0 bg-gradient-to-br from-[#3076F9]/10 via-transparent to-[#F930C7]/10 animate-pulse" />
        ) : (
          // Signed out: More prominent gradient
          <div className="absolute inset-0 bg-gradient-to-br from-[#3076F9]/20 via-transparent to-[#F930C7]/20" />
        )}

        {/* Animated particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#3076F9]/30 rounded-full animate-ping" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#F930C7]/40 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#3076F9]/20 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
