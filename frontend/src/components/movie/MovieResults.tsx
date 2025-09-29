import type { Movie } from "../../types/movie";

interface MovieResultsProps {
  movies: Movie[];
}

export default function MovieResults({ movies }: MovieResultsProps) {
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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Your Movie Recommendations
      </h3>

      <div className="grid gap-6">
        {movies.map((movie) => (
          <div
            key={`${movie.title}-${movie.year}`}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Movie Poster */}
              {movie.posterUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={`/api/proxy/image?url=${encodeURIComponent(
                      movie.posterUrl
                    )}`}
                    alt={`${movie.title} poster`}
                    className="w-32 h-48 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Movie Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h4 className="text-xl font-bold text-white">
                    {movie.title} ({movie.year})
                  </h4>
                  <div className="flex items-center gap-2">
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

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {movie.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
  );
}
