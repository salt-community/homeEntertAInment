import { SessionSidebar, CreateSessionCard } from "../components";

export default function BoardGameRuleInspector() {
  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 bg-black border-r border-gray-800">
          <SessionSidebar className="h-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                  Create New Session
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-[#F930C7]/50 to-transparent flex-1 ml-4"></div>
              </div>
              <CreateSessionCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
