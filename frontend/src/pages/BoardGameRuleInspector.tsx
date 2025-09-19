import { SessionSidebar, CreateSessionCard } from "../components";

export default function BoardGameRuleInspector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 shadow-lg">
          <SessionSidebar className="h-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Board Game Rule Inspector
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your game sessions and explore rule sets
                  </p>
                </div>
              </div>
            </div>

            {/* Create Session Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create New Session
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 ml-4"></div>
              </div>
              <CreateSessionCard />
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width={32}
                      height={32}
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width={32}
                      height={32}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Rule Sets
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width={32}
                      height={32}
                    >
                      <polygon points="12,2 15,8 22,8 17,12 19,18 12,15 5,18 7,12 2,8 9,8" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Players
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Activity
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 ml-4"></div>
              </div>
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
                <p className="text-gray-500 text-sm">No recent activity</p>
                <p className="text-gray-400 text-xs mt-1">
                  Create your first session to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
