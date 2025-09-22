import React, { useState, useEffect, useCallback } from "react";
import type { Session } from "../types/gameSession";
import { API_ENDPOINTS } from "../services/api";

interface SessionInfoProps {
  sessionId: number;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ sessionId }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
        const response = await fetch(API_ENDPOINTS.SESSION_BY_ID(sessionId));
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
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const formatRules = (rules: string) => {
    // Convert markdown-style formatting to HTML-like display
    return rules
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/# (.*?)\n/g, '<h1 class="text-lg font-bold mb-2">$1</h1>')
      .replace(/## (.*?)\n/g, '<h2 class="text-md font-semibold mb-2 mt-4">$1</h2>')
      .replace(/\n/g, '<br>');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
      {/* Game Name */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{session.gameName}</h1>
            <p className="text-sm text-gray-600">
              Session ID: {session.id}
            </p>
        </div>
      </div>

      {/* Players */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Players ({session.players.length})</h3>
        <div className="flex flex-wrap gap-2">
            {session.players.map((player) => (
            <span
              key={player.id}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
            >
              {player.playerName}
            </span>
          ))}
        </div>
      </div>

      {/* Game State */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.isActive
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            {session.isActive ? "Active" : "Inactive"}
          </span>
          {session.gameState && (
            <>
              <span className="text-sm font-medium text-gray-700">State:</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium border border-indigo-200">
                {session.gameState}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Rules Section */}
      {session.ruleSet && (
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-700">Game Rules</h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
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
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div
                className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatRules(session.ruleSet.decodedData || "No rules available")
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
