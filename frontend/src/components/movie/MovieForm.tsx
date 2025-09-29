import { useState } from "react";
import type { MovieRequest } from "../../types/movie";

interface MovieFormProps {
  onSubmit: (payload: MovieRequest) => void | Promise<void>;
  disabled?: boolean;
}

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

const AGE_RATINGS = ["G", "PG", "PG-13", "R", "NC-17"];

const DECADES = ["1990s", "2000s", "2010s", "2020s"];

const MOODS = [
  "Light and Fun",
  "Dark and Serious",
  "Inspiring",
  "Relaxing",
  "Intense",
  "Romantic",
  "Mysterious",
  "Adventurous",
  "Thought-provoking",
  "Comedy",
];

export default function MovieForm({ onSubmit, disabled }: MovieFormProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ageRating, setAgeRating] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [decade, setDecade] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedGenres.length > 3) {
      newErrors.genres = "Maximum 3 genres can be selected";
    }

    if (
      duration &&
      (isNaN(Number(duration)) ||
        Number(duration) < 30 ||
        Number(duration) > 300)
    ) {
      newErrors.duration = "Duration must be between 30 and 300 minutes";
    }

    if (customDescription && customDescription.length > 500) {
      newErrors.customDescription =
        "Custom description must be 500 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: MovieRequest = {
      ...(selectedGenres.length > 0 && { genres: selectedGenres }),
      ...(ageRating && { ageRating }),
      ...(duration && { duration: Number(duration) }),
      ...(decade && { decade }),
      ...(mood && { mood }),
      ...(customDescription.trim() && {
        customDescription: customDescription.trim(),
      }),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Genre Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Genres (Optional - Select up to 3)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GENRES.map((genre) => (
            <label
              key={genre}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                disabled={disabled}
                className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-sm text-white">{genre}</span>
            </label>
          ))}
        </div>
        {errors.genres && (
          <p className="text-red-400 text-sm mt-1">{errors.genres}</p>
        )}
      </div>

      {/* Age Rating */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Age Rating (Optional)
        </label>
        <select
          value={ageRating}
          onChange={(e) => setAgeRating(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Any age rating</option>
          {AGE_RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Duration (Optional - minutes)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={disabled}
          placeholder="e.g., 120"
          min="30"
          max="300"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {errors.duration && (
          <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
        )}
      </div>

      {/* Decade */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Release Decade (Optional)
        </label>
        <select
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Any decade</option>
          {DECADES.map((dec) => (
            <option key={dec} value={dec}>
              {dec}
            </option>
          ))}
        </select>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Mood (Optional)
        </label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Any mood</option>
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tell us more about what you're looking for (Optional)
        </label>
        <textarea
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          disabled={disabled}
          placeholder="e.g., 'I want a movie that will make me laugh and feel good about life' or 'Looking for something with great cinematography and deep themes'"
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {customDescription.length}/500 characters • Press Enter to search
        </p>
        {errors.customDescription && (
          <p className="text-red-400 text-sm mt-1">
            {errors.customDescription}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        disabled={disabled}
      >
        Find My Movies
      </button>
    </form>
  );
}
