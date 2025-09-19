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
      <div className={`bg-white border-r border-gray-200 p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessions</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border-r border-gray-200 p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessions</h2>
        <div className="text-red-600 text-sm">
          <p>Error loading sessions</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessions</h2>
      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.sessionId}
            className="p-3 bg-gray-50 rounded border"
          >
            <div className="font-medium text-gray-900">{session.gameName}</div>
            <div className="text-sm text-gray-600">
              {new Date(session.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
