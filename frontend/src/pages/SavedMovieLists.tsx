import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MovieService } from "../services/movieService";
import type { MovieListSummary, MovieListDetail } from "../types/movie";

export default function SavedMovieLists() {
  const { getToken, isSignedIn } = useAuth();
  const [lists, setLists] = useState<MovieListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<MovieListDetail | null>(
    null
  );
  const [showListDetail, setShowListDetail] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      loadMovieLists();
    }
  }, [isSignedIn]);

  const loadMovieLists = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSignedIn) {
        throw new Error("You must be signed in to view your saved lists.");
      }

      const token = await getToken();
      const userLists = await MovieService.getUserMovieLists(
        token || undefined
      );
      setLists(userLists);
    } catch (err) {
      console.error("Error loading movie lists:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load movie lists"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewList = async (listId: number) => {
    try {
      if (!isSignedIn) return;

      const token = await getToken();
      const listDetail = await MovieService.getMovieList(
        listId,
        token || undefined
      );
      setSelectedList(listDetail);
      setShowListDetail(true);
    } catch (err) {
      console.error("Error loading list detail:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load list details"
      );
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      if (!isSignedIn) return;

      const token = await getToken();
      await MovieService.deleteMovieList(listId, token || undefined);

      await loadMovieLists();

      if (selectedList && selectedList.id === listId) {
        setShowListDetail(false);
        setSelectedList(null);
      }
    } catch (err) {
      console.error("Error deleting list:", err);
      setError(err instanceof Error ? err.message : "Failed to delete list");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isSignedIn) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
          <p className="text-gray-400">
            You need to be signed in to view your saved movie lists.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-purple-500 transition ease-in-out duration-150 cursor-not-allowed">
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
          Loading your movie lists...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-semibold text-white">
          My Saved Movie Lists
        </h2>
        <p className="text-sm text-white/80 mt-2">
          {lists.length === 0
            ? "No saved lists yet. Create some movie recommendations to get started!"
            : `You have ${lists.length} saved movie list${
                lists.length === 1 ? "" : "s"
              }`}
        </p>

        {/* Navigation back to movie search */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => (window.location.href = "/movie-mood")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
          >
            🔍 New Movie Search
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-4xl">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {lists.length === 0 ? (
        <div className="w-full max-w-2xl">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-white text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
              <p className="text-gray-400 mb-6">
                Start by creating movie recommendations and save your favorites!
              </p>
              <button
                onClick={() => (window.location.href = "/movie-mood")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
              >
                Find Movies Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]"
            >
              <div className="rounded-[10px] bg-black p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {list.listName}
                    </h3>
                    {list.description && (
                      <p className="text-gray-300 mb-3">{list.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>📽️ {list.movieCount} movies</span>
                      <span>📅 {formatDate(list.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewList(list.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm border border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List Detail Modal */}
      {showListDetail && selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedList.listName}
                  </h3>
                  {selectedList.description && (
                    <p className="text-gray-300 mt-2">
                      {selectedList.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mt-2">
                    Created on {formatDate(selectedList.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowListDetail(false)}
                  className="text-red-400 hover:text-red-300 text-4xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {selectedList.movies.map((movie) => (
                  <div
                    key={`${movie.title}-${movie.year}`}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">
                            {movie.title} ({movie.year})
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400 font-semibold">
                              ⭐ {movie.rating}/10
                            </span>
                            <span className="text-gray-400 text-sm">
                              {movie.ageRating} • {movie.duration}min
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {movie.genres &&
                            movie.genres.map((genre) => (
                              <span
                                key={genre}
                                className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                              >
                                {genre}
                              </span>
                            ))}
                        </div>

                        <p className="text-gray-300 mb-3 text-sm">
                          {movie.description}
                        </p>

                        <div className="text-sm text-gray-400 mb-2">
                          <p>
                            <span className="font-medium">Director:</span>{" "}
                            {movie.director}
                          </p>
                          <p>
                            <span className="font-medium">Cast:</span>{" "}
                            {movie.cast && movie.cast.slice(0, 3).join(", ")}
                            {movie.cast && movie.cast.length > 3 && "..."}
                          </p>
                        </div>

                        <div className="bg-purple-900/20 rounded-lg p-3">
                          <p className="text-sm text-purple-200">
                            <span className="font-medium">Why we recommend this:</span>{" "}
                            {movie.recommendationReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
