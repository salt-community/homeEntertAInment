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
    <div className="bg-black rounded-xl shadow-lg border border-gray-800 p-6 hover:shadow-xl hover:border-[#F930C7]/50 transition-all duration-300 bg-gradient-to-br from-black to-gray-900">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-[#F930C7] to-[#3076F9] rounded-lg flex items-center justify-center shadow-md">
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
        <h2 className="text-xl font-semibold bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
          Create New Game Session
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game Name */}
        <div>
          <label
            htmlFor="gameName"
            className="block text-sm font-medium text-white/80 mb-1"
          >
            Game Name *
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="e.g., Monopoly, Chess, Catan"
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:border-[#3076F9] transition-all duration-200 bg-gray-800 hover:border-gray-600 text-white"
            style={{ color: "#ffffff", backgroundColor: "#1f2937" }}
            required
          />
        </div>

        {/* Player Names */}
        <div>
          <label
            htmlFor="playerNames"
            className="block text-sm font-medium text-white/80 mb-1"
          >
            Player Names
          </label>
          <input
            type="text"
            id="playerNames"
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            placeholder="e.g., Alice, Bob, Charlie (comma-separated)"
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:border-[#3076F9] transition-all duration-200 bg-gray-800 hover:border-gray-600 text-white"
            style={{ color: "#ffffff", backgroundColor: "#1f2937" }}
          />
          <p className="text-xs text-white/60 mt-1">
            Enter player names separated by commas
          </p>
        </div>

        {/* Rule File Upload */}
        <div>
          <label
            htmlFor="ruleFile"
            className="block text-sm font-medium text-white/80 mb-1"
          >
            Game Rules PDF *
          </label>
          <input
            type="file"
            id="ruleFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:border-[#3076F9] transition-all duration-200 bg-gray-800 hover:border-gray-600 text-white"
            required
          />
          <p className="text-xs text-white/60 mt-1">
            Upload a PDF file containing the game rules
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center space-x-2 shadow-sm">
            <svg
              className="w-5 h-5 text-red-400"
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
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center space-x-2 shadow-sm">
            <svg
              className="w-5 h-5 text-green-400"
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
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white rounded-lg hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isCreating ? "Creating Session..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};
