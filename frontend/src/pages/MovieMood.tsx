import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MovieService } from "../services/movieService";
import MovieForm from "../components/movie/MovieForm";
import MovieResults from "../components/movie/MovieResults";
import type { MovieRequest, MovieResponse } from "../types/movie";

export default function MovieMood() {
  const { getToken, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MovieResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleFormSubmit = async (payload: MovieRequest) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setSaveSuccess(null);

    try {
      if (!isSignedIn) {
        throw new Error("You must be signed in to get recommendations.");
      }
      const token = await getToken();
      const response = await MovieService.getRecommendations(
        payload,
        token || undefined
      );
      console.log("API Response:", response); // Debug logging

      // Validate response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      if (!response.movies) {
        throw new Error("No movies array in response");
      }

      setResults(response);
    } catch (err) {
      console.error("Movie recommendation error:", err); // Debug logging
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get movie recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveList = async (
    listName: string,
    description: string,
    searchCriteria: string
  ) => {
    if (!results || !isSignedIn) return;

    try {
      const token = await getToken();
      const response = await MovieService.saveMovieList(
        listName,
        description,
        searchCriteria,
        results,
        token || undefined
      );

      if (response.success) {
        setSaveSuccess(`"${listName}" saved successfully!`);
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("Save list error:", err);
      setError(err instanceof Error ? err.message : "Failed to save movie list");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">Movie Picker</h2>
        <p className="text-sm text-white/80 mb-4 px-2">
          Tell us what kind of movie you're in the mood for, and we'll recommend
          the perfect films for you.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 px-4">
          <button
            onClick={() => (window.location.href = "/saved-movies")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <span>📚</span>
            <span>View Saved Lists</span>
          </button>
          {/* Only show New Search button if user has already searched */}
          {results && results.movies && (
            <button
              onClick={() => {
                setResults(null);
                setError(null);
                setSaveSuccess(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              <span>New Search</span>
            </button>
          )}
        </div>
      </div>

      {/* Show form only if no results, no loading, or user wants new search */}
      {!loading && (!results || !results.movies) && (
        <div className="w-full max-w-2xl px-4">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-4 sm:p-6 lg:p-8 text-white">
              <MovieForm onSubmit={handleFormSubmit} disabled={loading} />
            </div>
          </div>
        </div>
      )}

      {/* Show loading in main content area */}
      {loading && (
        <div className="w-full max-w-4xl text-center px-4">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-6 sm:p-8 text-white">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-lg sm:text-xl font-semibold">
                  Finding Your Perfect Movies...
                </div>
                <div className="text-gray-400 text-sm">
                  This may take a few moments
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl px-4">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="w-full max-w-2xl px-4">
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-sm sm:text-base">{saveSuccess}</p>
          </div>
        </div>
      )}

      {/* Show results at the top if they exist */}
      {!loading && results && results.movies && (
        <div className="w-full max-w-4xl px-4">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-4 sm:p-6 lg:p-8 text-white">
              <MovieResults movies={results.movies} onSaveList={handleSaveList} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
