import { SessionSidebar, CreateSessionCard, ChatInterface } from "../components";
import { useParams } from "@tanstack/react-router";

export default function BoardGameRuleInspector() {
  const { sessionId } = useParams({ from: "/board-game-rule-inspector/session/$sessionId" });

  // If we're on a session-specific route, show the chat interface
  if (sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 shadow-2xl border-r border-indigo-100">
            <SessionSidebar className="h-full" />
          </div>

          {/* Chat Interface */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <ChatInterface sessionId={parseInt(sessionId)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view - session management
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 shadow-2xl border-r border-indigo-100">
          <SessionSidebar className="h-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width={32}
                    height={32}
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
                    Board Game Rule Inspector
                  </h1>
                  <p className="text-indigo-600 mt-1 font-medium">
                    Manage your game sessions and explore rule sets
                  </p>
                </div>
              </div>
            </div>

            {/* Create Session Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-800 to-purple-700 bg-clip-text text-transparent">
                  Create New Session
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent flex-1 ml-4"></div>
              </div>
              <CreateSessionCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
