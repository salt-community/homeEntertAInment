import React from "react";
import { useSessions } from "../hooks/useSessions";
import { useNavigate } from "@tanstack/react-router";

interface SessionSidebarProps {
  className?: string;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  className = "",
}) => {
  const { sessions, isLoading, error } = useSessions();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className={`bg-white border-r border-indigo-100 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
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
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-800 to-purple-700 bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white border-r border-indigo-100 flex flex-col h-full shadow-lg ${className}`}
      >
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
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
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-800 to-purple-700 bg-clip-text text-transparent">
              Game Sessions
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
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
            <p className="text-red-600 text-sm mb-1">Error loading sessions</p>
            <p className="text-gray-400 text-xs">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
    >
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
          <h2 className="text-lg font-semibold text-gray-900">Game Sessions</h2>
        </div>
        <p className="text-sm text-indigo-600 mt-1 font-medium">
          Manage your active games
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-indigo-600 text-sm mb-1 font-medium">
              No sessions found
            </p>
            <p className="text-indigo-500 text-xs">
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
                className="p-4 rounded-xl transition-all duration-300 bg-white border border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg hover:border-indigo-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-indigo-800 text-sm">
                    {session.gameName}
                  </h4>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.isActive ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-indigo-600">ID: {session.id}</p>
                  <p className="text-xs text-indigo-600">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  {session.players && session.players.length > 0 && (
                    <p className="text-xs text-purple-600 font-medium">
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
