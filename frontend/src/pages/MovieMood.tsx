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

  const handleFormSubmit = async (payload: MovieRequest) => {
    setLoading(true);
    setError(null);
    setResults(null);

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

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-white">Movie Picker</h2>
        <p className="text-sm text-white/80">
          Tell us what kind of movie you're in the mood for, and we'll recommend
          the perfect films for you.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
          <div className="rounded-[10px] bg-black p-8 text-white">
            <MovieForm onSubmit={handleFormSubmit} disabled={loading} />
          </div>
        </div>
      </div>

      {loading && (
        <div className="w-full max-w-2xl text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-purple-500 hover:bg-purple-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Finding your perfect movies...
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {results && results.movies && (
        <div className="w-full max-w-4xl">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-white">
              <MovieResults movies={results.movies} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
