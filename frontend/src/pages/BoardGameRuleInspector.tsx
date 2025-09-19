import React from "react";
import { SessionSidebar } from "../components/SessionSidebar";

export default function BoardGameRuleInspector() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 flex-shrink-0">
        <SessionSidebar className="h-full" />
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Board Game Rule Inspector
        </h1>
        <p className="text-gray-600 mt-2">
          Sessions are displayed in the sidebar.
        </p>
      </div>
    </div>
  );
}
