import { SessionSidebar, ChatInterface, SessionInfo } from "../components";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

export default function BoardGameSessionChat() {
  const { sessionId } = useParams({
    from: "/board-game-rule-inspector/session/$sessionId",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen max-h-screen">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          w-80 flex-shrink-0 bg-black border-r border-gray-800 z-50
          lg:relative lg:translate-x-0
          ${
            isSidebarOpen
              ? "fixed translate-x-0"
              : "fixed -translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300 ease-in-out
        `}
        >
          <SessionSidebar className="h-full" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden bg-black border-b border-gray-800 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white hover:opacity-80 transition-opacity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Sessions - Board Game Assistant
                  </span>
                </button>
              </div>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Session Info - Compact on mobile */}
          <div className="p-4 lg:p-6 pb-2 lg:pb-0 flex-shrink-0">
            <SessionInfo sessionId={parseInt(sessionId)} />
          </div>

          {/* Chat Interface - Takes most of the available space */}
          <div
            className="flex-1 p-4 lg:p-6 pt-0 lg:pt-4 min-h-0"
            style={{ minHeight: "400px" }}
          >
            <ChatInterface sessionId={parseInt(sessionId)} />
          </div>
        </div>
      </div>
    </div>
  );
}
