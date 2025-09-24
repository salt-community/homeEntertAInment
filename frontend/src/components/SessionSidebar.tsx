import React from "react";
import { useSessions } from "../hooks/useSessions";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";

interface SessionSidebarProps {
  className?: string;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  className = "",
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const { sessions, isLoading, error } = useSessions();
  const navigate = useNavigate();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div
        className={`bg-black border-r border-gray-800 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not signed in
  if (!isSignedIn) {
    return (
      <div
        className={`bg-black border-r border-gray-800 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F930C7]/20 to-[#3076F9]/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-[#3076F9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-white/70 text-sm mb-1 font-medium">
              Please log in to access your sessions
            </p>
            <p className="text-white/50 text-xs">
              Sign in to view and manage your game sessions
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`bg-black border-r border-gray-800 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-black border-r border-gray-800 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-400 text-sm mb-1">Error loading sessions</p>
            <p className="text-gray-400 text-xs">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-black border-r border-gray-800 flex flex-col h-full ${className}`}
    >
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width={32}
              height={32}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
            Game Sessions
          </h2>
        </div>
        <p className="text-sm text-white/70 mt-1 font-medium">
          Manage your active games
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F930C7]/20 to-[#3076F9]/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-[#3076F9]"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-white/70 text-sm mb-1 font-medium">
              No sessions found
            </p>
            <p className="text-white/50 text-xs">
              Create your first session to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() =>
                  navigate({
                    to: `/board-game-rule-inspector/session/${session.id}`,
                  })
                }
                className="p-4 rounded-xl transition-all duration-300 bg-black border border-gray-800 hover:bg-gradient-to-r hover:from-[#F930C7]/10 hover:to-[#3076F9]/10 hover:shadow-lg hover:border-[#F930C7]/50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">
                    {session.gameName}
                  </h4>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.isActive ? "bg-emerald-400" : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/60">ID: {session.id}</p>
                  <p className="text-xs text-white/60">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  {session.players && session.players.length > 0 && (
                    <p className="text-xs text-[#F930C7] font-medium">
                      {session.players.length} player(s)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
