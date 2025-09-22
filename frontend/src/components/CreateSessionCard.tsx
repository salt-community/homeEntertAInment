import { useState } from "react";
import { useSessions } from "../hooks/useSessions";
import { API_ENDPOINTS } from "../services/api";

export const CreateSessionCard = () => {
  const [gameName, setGameName] = useState("");
  const [playerNames, setPlayerNames] = useState("");
  const [ruleFile, setRuleFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { refetch } = useSessions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setRuleFile(file);
        setError(null);
      } else {
        setError("Please select a PDF file");
        setRuleFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameName.trim()) {
      setError("Game name is required");
      return;
    }

    if (!ruleFile) {
      setError("Please select a PDF rule file");
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("gameName", gameName.trim());
      formData.append("playerNames", playerNames.trim());
      formData.append("ruleFile", ruleFile);

      const response = await fetch(API_ENDPOINTS.SESSIONS_CREATE_WITH_RULES, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const session = await response.json();
      setSuccess(`Session "${session.gameName}" created successfully!`);

      // Reset form
      setGameName("");
      setPlayerNames("");
      setRuleFile(null);

      // Refresh sessions list
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={32}
            height={32}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-800 to-cyan-700 bg-clip-text text-transparent">
          Create New Game Session
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game Name */}
        <div>
          <label
            htmlFor="gameName"
            className="block text-sm font-medium text-indigo-700 mb-1"
          >
            Game Name *
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="e.g., Monopoly, Chess, Catan"
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200 bg-white hover:border-indigo-300"
            required
          />
        </div>

        {/* Player Names */}
        <div>
          <label
            htmlFor="playerNames"
            className="block text-sm font-medium text-indigo-700 mb-1"
          >
            Player Names
          </label>
          <input
            type="text"
            id="playerNames"
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            placeholder="e.g., Alice, Bob, Charlie (comma-separated)"
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200 bg-white hover:border-indigo-300"
          />
          <p className="text-xs text-indigo-500 mt-1">
            Enter player names separated by commas
          </p>
        </div>

        {/* Rule File Upload */}
        <div>
          <label
            htmlFor="ruleFile"
            className="block text-sm font-medium text-indigo-700 mb-1"
          >
            Game Rules PDF *
          </label>
          <input
            type="file"
            id="ruleFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200 bg-white hover:border-indigo-300"
            required
          />
          <p className="text-xs text-indigo-500 mt-1">
            Upload a PDF file containing the game rules
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 shadow-sm">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2 shadow-sm">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isCreating ? "Creating Session..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};
