import React, { useState, useEffect, useCallback } from "react";
import type { Session } from "../types/gameSession";
import { API_ENDPOINTS } from "../services/api";
import { useAuthenticatedFetch } from "../services/apiClient";

interface SessionInfoProps {
  sessionId: number;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ sessionId }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);
  const authenticatedFetch = useAuthenticatedFetch();

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authenticatedFetch(
        API_ENDPOINTS.SESSION_BY_ID(sessionId)
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`);
      }
      const sessionData = await response.json();
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, authenticatedFetch]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const formatRules = (rules: string) => {
    // Convert markdown-style formatting to HTML-like display
    return rules
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/# (.*?)\n/g, '<h1 class="text-lg font-bold mb-2">$1</h1>')
      .replace(
        /## (.*?)\n/g,
        '<h2 class="text-md font-semibold mb-2 mt-4">$1</h2>'
      )
      .replace(/\n/g, "<br>");
  };

  if (isLoading) {
    return (
      <div className="bg-black rounded-lg shadow-md border border-gray-800 p-3 lg:p-4 mb-3 lg:mb-4">
        <div className="animate-pulse">
          <div className="h-5 lg:h-6 bg-gray-800 rounded w-1/3 mb-2"></div>
          <div className="h-3 lg:h-4 bg-gray-800 rounded w-1/2 mb-3 lg:mb-4"></div>
          <div className="h-3 lg:h-4 bg-gray-800 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 lg:p-4 mb-3 lg:mb-4">
        <p className="text-red-400 text-xs lg:text-sm">{error}</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-black rounded-lg shadow-md border border-gray-800 p-4 lg:p-6 mb-2 lg:mb-4">
      {/* Game Name */}
      <div className="flex items-center space-x-3 mb-3 lg:mb-4">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
          <svg
            className="w-4 h-4 lg:w-5 lg:h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
            {session.gameName}
          </h1>
        </div>
      </div>

      {/* Players */}
      <div className="mb-3 lg:mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
          Players ({session.players.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {session.players.map((player) => (
            <span
              key={player.id}
              className="px-2 py-1 lg:px-3 lg:py-1 bg-gradient-to-r from-[#F930C7]/20 to-[#3076F9]/20 text-white rounded-full text-xs lg:text-sm font-medium border border-[#F930C7]/50"
            >
              {player.playerName}
            </span>
          ))}
        </div>
      </div>

      {/* Rules Section */}
      {session.ruleSet && (
        <div className="border-t border-gray-800 pt-3 lg:pt-4">
          <button
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="flex items-center justify-between w-full text-left hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <h3 className="text-base lg:text-lg font-semibold text-white">
              Game Rules
            </h3>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 text-white/60 transition-transform ${
                isRulesExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isRulesExpanded && (
            <div className="mt-3 p-3 lg:p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div
                className="text-xs lg:text-sm text-white/80 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatRules(
                    session.ruleSet.decodedData || "No rules available"
                  ),
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
