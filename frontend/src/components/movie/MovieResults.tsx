import { useState } from "react";
import type { Movie } from "../../types/movie";

interface MovieResultsProps {
  movies: Movie[];
  onSaveList?: (
    listName: string,
    description: string,
    searchCriteria: string
  ) => Promise<void>;
}

export default function MovieResults({
  movies,
  onSaveList,
}: MovieResultsProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveList = async () => {
    if (!listName.trim() || !onSaveList) return;

    setIsSaving(true);
    try {
      const searchCriteria = JSON.stringify({
        movieCount: movies.length,
        savedAt: new Date().toISOString(),
      });

      await onSaveList(listName.trim(), description.trim(), searchCriteria);
      setShowSaveModal(false);
      setListName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to save list:", error);
    } finally {
      setIsSaving(false);
    }
  };
  // Handle null, undefined, or empty movies array
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          No movies found. Try adjusting your preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-white">
          Your Movie Recommendations
        </h3>
        {onSaveList && (
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>Save List</span>
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6">
        {movies.map((movie) => (
          <div
            key={`${movie.title}-${movie.year}`}
            className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Movie Poster */}
              {movie.posterUrl && (
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={`/api/proxy/image?url=${encodeURIComponent(
                      movie.posterUrl
                    )}`}
                    alt={`${movie.title} poster`}
                    className="w-24 h-36 sm:w-32 sm:h-48 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Movie Details */}
              <div className="flex-1">
                <div className="flex flex-col gap-2 mb-3">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {movie.title} ({movie.year})
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-yellow-400 font-semibold text-sm sm:text-base">
                      ⭐ {movie.rating}/10
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {movie.ageRating} • {movie.duration}min
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
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

                <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                  {movie.description}
                </p>

                <div className="grid grid-cols-1 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400">Director: </span>
                    <span className="text-white">{movie.director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cast: </span>
                    <span className="text-white">
                      {movie.cast && movie.cast.slice(0, 3).join(", ")}
                      {movie.cast && movie.cast.length > 3 && "..."}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                  <p className="text-xs sm:text-sm text-purple-200">
                    <span className="font-medium">Why we recommend this:</span>{" "}
                    {movie.recommendationReason}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Save Movie List
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="e.g., My Action Movies"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Great action movies for movie night"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveList}
                disabled={!listName.trim() || isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base order-1 sm:order-2"
              >
                {isSaving ? "Saving..." : "Save List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
