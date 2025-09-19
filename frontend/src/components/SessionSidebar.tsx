import React from "react";
import { useSessions } from "../hooks/useSessions";
import type { Session } from "../types/gameSession";

interface SessionSidebarProps {
  className?: string;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  className = "",
}) => {
  const { sessions, isLoading, error } = useSessions();

  if (isLoading) {
    return (
      <div
        className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
            <h2 className="text-lg font-semibold text-gray-900">
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
        className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
            <h2 className="text-lg font-semibold text-gray-900">
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
        <p className="text-sm text-gray-600 mt-1">Manage your active games</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={32}
                height={32}
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-1">No sessions found</p>
            <p className="text-gray-400 text-xs">
              Create your first session to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl transition-all duration-200 bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {session.gameName}
                  </h4>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    ID: {session.sessionId.slice(0, 12)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  {session.players && session.players.length > 0 && (
                    <p className="text-xs text-gray-500">
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
