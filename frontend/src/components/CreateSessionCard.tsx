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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Create New Game Session
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game Name */}
        <div>
          <label
            htmlFor="gameName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Game Name *
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="e.g., Monopoly, Chess, Catan"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Player Names */}
        <div>
          <label
            htmlFor="playerNames"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Player Names
          </label>
          <input
            type="text"
            id="playerNames"
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            placeholder="e.g., Alice, Bob, Charlie (comma-separated)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter player names separated by commas
          </p>
        </div>

        {/* Rule File Upload */}
        <div>
          <label
            htmlFor="ruleFile"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Game Rules PDF *
          </label>
          <input
            type="file"
            id="ruleFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a PDF file containing the game rules
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? "Creating Session..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};
