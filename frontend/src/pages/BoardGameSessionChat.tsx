import { SessionSidebar, ChatInterface, SessionInfo } from "../components";
import { useParams } from "@tanstack/react-router";

export default function BoardGameSessionChat() {
  const { sessionId } = useParams({ from: "/board-game-rule-inspector/session/$sessionId" });

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 bg-black border-r border-gray-800">
          <SessionSidebar className="h-full" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Session Info */}
          <div className="p-6 pb-0">
            <SessionInfo sessionId={parseInt(sessionId)} />
          </div>

          {/* Chat Interface */}
          <div className="flex-1 p-6 pt-4">
            <div className="h-full">
              <ChatInterface sessionId={parseInt(sessionId)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
