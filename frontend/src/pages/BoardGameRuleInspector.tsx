import { SessionSidebar, CreateSessionCard } from "../components";
import { useState } from "react";

export default function BoardGameRuleInspector() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden bg-black border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                Board Game Assistant
              </h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          <div className="p-4 lg:p-8">
            {/* Header Section - Hidden on mobile, shown on desktop */}
            <div className="mb-6 lg:mb-8 hidden lg:block">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-xl flex items-center justify-center shadow-lg">
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                    Board Game Rule Inspector
                  </h1>
                  <p className="text-white/70 mt-1 font-medium">
                    Manage your game sessions and explore rule sets
                  </p>
                </div>
              </div>
            </div>

            {/* Create Session Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                  Create New Session
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-[#F930C7]/50 to-transparent flex-1 ml-4 hidden lg:block"></div>
              </div>
              <CreateSessionCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
